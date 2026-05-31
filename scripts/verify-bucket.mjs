import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";
const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const s3 = new S3Client({
  region: process.env.APP_REGION,
  credentials: {
    accessKeyId: process.env.APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
  },
});
try {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME, Key: ".__diag__",
    Body: "diag", ContentType: "text/plain",
  }));
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: ".__diag__" }));
  console.log(`✓ PutObject + DeleteObject on ${process.env.S3_BUCKET_NAME} succeeded`);
} catch (e) {
  console.log(`✗ ${e.name} (HTTP ${e.$metadata?.httpStatusCode}): ${e.message}`);
}
