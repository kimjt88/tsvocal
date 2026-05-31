import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const candidates = [
  "tsvocal",
  "amzn-s3-tsvocal-bucket",
  "tsvocal-bucket",
  "tsvocal-academy",
  "ts-vocal",
];

const credentials = {
  accessKeyId: process.env.APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
};

for (const bucket of candidates) {
  let found = false;
  for (const region of ["ap-northeast-2", "ap-southeast-2"]) {
    const s3 = new S3Client({ region, credentials });
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucket }));
      console.log(`✓ "${bucket}" exists in ${region}`);
      found = true;
      break;
    } catch (e) {
      const actual = e.$response?.headers?.["x-amz-bucket-region"];
      if (actual && actual !== region) {
        // bucket exists but in different region
        console.log(`✓ "${bucket}" exists in ${actual} (probed via ${region})`);
        found = true;
        break;
      }
    }
  }
  if (!found) console.log(`✗ "${bucket}" not found`);
}
