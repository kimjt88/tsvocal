import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { env } from "./env";

export const s3 = new S3Client({
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.awsAccessKeyId,
    secretAccessKey: env.awsSecretAccessKey,
  },
});

export async function presignUpload(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
}

export async function presignDownload(key: string) {
  const cmd = new GetObjectCommand({ Bucket: env.s3Bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 60 * 60 });
}

export function publicUrl(key: string) {
  return `https://${env.s3Bucket}.s3.${env.awsRegion}.amazonaws.com/${encodeURI(key)}`;
}
