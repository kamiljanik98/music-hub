import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUCKETS, r2 } from "@/lib/r2/client";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const MIN_ORPHAN_AGE_MS = 24 * 60 * 60 * 1000;

type R2Object = { key: string; lastModified?: Date };

async function listAllObjects(bucket: string): Promise<R2Object[]> {
  const objects: R2Object[] = [];
  let continuationToken: string | undefined;

  do {
    const result = await r2.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      }),
    );
    for (const obj of result.Contents ?? []) {
      if (obj.Key) {
        objects.push({ key: obj.Key, lastModified: obj.LastModified });
      }
    }
    continuationToken = result.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

async function deleteKeys(
  bucket: string,
  keys: string[],
): Promise<{ deleted: string[]; failed: string[] }> {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const key of keys) {
    try {
      await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      deleted.push(key);
    } catch {
      failed.push(key);
    }
  }

  return { deleted, failed };
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET is not set - refusing to run cleanup");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const [{ data: songs }, { data: stems }] = await Promise.all([
    supabase.from("songs").select("path, image_path"),
    supabase.from("stems").select("path"),
  ]);

  const dbPaths = {
    songs: new Set((songs ?? []).map((s) => s.path)),
    covers: new Set(
      (songs ?? []).map((s) => s.image_path).filter(Boolean) as string[],
    ),
    stems: new Set((stems ?? []).map((s) => s.path)),
  };

  const deletionResults: Record<
    string,
    { deleted: string[]; failed: string[] }
  > = {};

  const cutoff = Date.now() - MIN_ORPHAN_AGE_MS;

  for (const [bucketKey, validPaths] of Object.entries(dbPaths)) {
    const bucketName = BUCKETS[bucketKey as keyof typeof BUCKETS];
    const r2Objects = await listAllObjects(bucketName);

    const orphanedKeys = r2Objects
      .filter(
        (obj) =>
          !validPaths.has(obj.key) &&
          obj.lastModified !== undefined &&
          obj.lastModified.getTime() < cutoff,
      )
      .map((obj) => obj.key);

    deletionResults[bucketKey] = await deleteKeys(bucketName, orphanedKeys);
  }

  console.log("Orphaned files deleted:", deletionResults);

  return NextResponse.json({ orphaned: deletionResults });
}
