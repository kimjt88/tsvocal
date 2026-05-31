import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const bucket = process.env.S3_BUCKET_NAME;
const credentials = {
  accessKeyId: process.env.APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
};

console.log(`Looking for bucket: ${bucket}`);
console.log(`APP_REGION: ${process.env.APP_REGION}`);
console.log(`NEXT_PUBLIC_S3_BASE_URL: ${process.env.NEXT_PUBLIC_S3_BASE_URL}`);
console.log("");

for (const region of ["ap-northeast-2", "ap-southeast-2", "us-east-1", "us-west-2"]) {
  const s3 = new S3Client({ region, credentials });
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✓ Bucket "${bucket}" reachable from ${region}`);
  } catch (e) {
    const actual = e.$response?.headers?.["x-amz-bucket-region"];
    console.log(`✗ ${region}: ${e.name} (${e.$metadata?.httpStatusCode})` + (actual ? ` — actual region: ${actual}` : ""));
  }
}
