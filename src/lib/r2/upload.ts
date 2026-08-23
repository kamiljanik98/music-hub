import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Bucket, BUCKETS, r2 } from "./client";

async function uploadToR2(
  file: File,
  bucket: Bucket,
  path: string,
): Promise<void> {
  const buffer = Buffer.from(await file.arrayBuffer());
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKETS[bucket],
      Key: path,
      Body: buffer,
      ContentType: file.type,
    }),
  );
}

export async function uploadSong(file: File, path: string): Promise<void> {
  return uploadToR2(file, "songs", path);
}

export async function uploadStem(file: File, path: string): Promise<void> {
  return uploadToR2(file, "stems", path);
}

export async function uploadCover(file: File, path: string): Promise<void> {
  return uploadToR2(file, "covers", path);
}

export async function uploadAvatar(file: File, path: string): Promise<void> {
  return uploadToR2(file, "avatars", path);
}

export async function uploadBanner(file: File, path: string): Promise<void> {
  return uploadToR2(file, "banners", path);
}

export async function deleteFromR2(
  bucket: Bucket,
  path: string,
): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKETS[bucket],
      Key: path,
    }),
  );
}
