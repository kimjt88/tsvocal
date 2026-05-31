import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
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
  const out = await s3.send(new ListBucketsCommand({}));
  console.log("Buckets visible to this IAM user:");
  for (const b of out.Buckets ?? []) {
    console.log(`  ${b.Name}  (created ${b.CreationDate?.toISOString().slice(0, 10)})`);
  }
} catch (e) {
  console.log(`ListBuckets failed: ${e.name} (HTTP ${e.$metadata?.httpStatusCode})`);
  console.log(`  → ${e.message}`);
  console.log("");
  console.log("ListBuckets requires s3:ListAllMyBuckets permission. If denied,");
  console.log("means IAM policy doesn't grant this — but that's separate from upload working.");
}
