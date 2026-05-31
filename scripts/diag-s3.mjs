import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const credentials = {
  accessKeyId: process.env.APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
};

for (const region of ["ap-northeast-2", "ap-southeast-2"]) {
  console.log(`--- Trying PutObject on amzn-s3-tsvocal-bucket from ${region} ---`);
  const s3 = new S3Client({ region, credentials });
  try {
    await s3.send(new PutObjectCommand({
      Bucket: "amzn-s3-tsvocal-bucket",
      Key: ".__diag__",
      Body: "diagnostic",
      ContentType: "text/plain",
    }));
    console.log(`✓ PutObject succeeded in ${region} — bucket exists AND IAM allows write`);
    break;
  } catch (e) {
    console.log(`✗ ${e.name} (HTTP ${e.$metadata?.httpStatusCode})`);
    console.log(`   ${e.message}`);
    const actual = e.$response?.headers?.["x-amz-bucket-region"];
    if (actual) console.log(`   → actual bucket region: ${actual}`);
    console.log("");
  }
}
