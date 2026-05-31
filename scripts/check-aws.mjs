// Verify Admins + AcademyData + tsvocal bucket all in ap-southeast-2.
import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

try {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const region = "ap-southeast-2";
const credentials = {
  accessKeyId: process.env.APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
};

const ddb = new DynamoDBClient({ region, credentials });
const s3 = new S3Client({ region, credentials });

for (const t of ["Admins", "AcademyData"]) {
  try {
    const d = await ddb.send(new DescribeTableCommand({ TableName: t }));
    const keys = d.Table.KeySchema.map(k => `${k.AttributeName}(${k.KeyType})`).join(", ");
    console.log(`✓ DynamoDB ${t}: keys=[${keys}] status=${d.Table.TableStatus} region=${region}`);
  } catch (e) {
    console.log(`✗ DynamoDB ${t}: ${e.name}: ${e.message}`);
  }
}

try {
  await s3.send(new HeadBucketCommand({ Bucket: "tsvocal" }));
  console.log(`✓ S3 tsvocal: reachable from ${region}`);
} catch (e) {
  // HeadBucket on wrong region returns 301 with x-amz-bucket-region header
  const actual = e.$response?.headers?.["x-amz-bucket-region"];
  console.log(`✗ S3 tsvocal: ${e.name} (HTTP ${e.$metadata?.httpStatusCode})` + (actual ? ` — actual region: ${actual}` : ""));
}
