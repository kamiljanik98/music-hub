import "server-only";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, Bucket, BUCKETS } from "./client";

type PresignOptions = {
  bucket?: Bucket;
  asAttachment?: boolean;
};

export async function getPresignedUrl(
  path: string,
  { bucket = "songs", asAttachment = false }: PresignOptions = {},
): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: BUCKETS[bucket],
      Key: path,
      ...(asAttachment && {
        ResponseContentDisposition: `attachment; filename="${path.split("/").pop() ?? path}"`,
      }),
    }),
    { expiresIn: 3600 },
  );
}
