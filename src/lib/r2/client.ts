import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const BUCKETS = {
  songs: process.env.R2_BUCKET_SONGS!,
  stems: process.env.R2_BUCKET_STEMS!,
  covers: process.env.R2_BUCKET_COVERS!,
  avatars: process.env.R2_BUCKET_AVATARS!,
  banners: process.env.R2_BUCKET_BANNERS!,
} as const;

export type Bucket = keyof typeof BUCKETS;

export const R2_COVERS_URL = process.env.NEXT_R2_COVERS_URL!;
export const R2_AVATARS_URL = process.env.NEXT_R2_AVATARS_URL!;
export const R2_BANNERS_URL = process.env.NEXT_R2_BANNERS_URL!;
