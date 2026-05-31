import { S3Client, PutObjectCommand, GetBucketPolicyCommand, GetPublicAccessBlockCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.APP_REGION;
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
  },
});

// 1. Bucket policy
console.log("=== Bucket policy ===");
try {
  const out = await s3.send(new GetBucketPolicyCommand({ Bucket: bucket }));
  console.log(out.Policy);
} catch (e) {
  if (e.name === "NoSuchBucketPolicy") {
    console.log("(no bucket policy attached) ← 공개 GET 정책이 안 붙어 있음. 이게 원인.");
  } else {
    console.log(`Failed: ${e.name}: ${e.message}`);
  }
}

console.log("");

// 2. Block Public Access
console.log("=== Public Access Block ===");
try {
  const out = await s3.send(new GetPublicAccessBlockCommand({ Bucket: bucket }));
  const c = out.PublicAccessBlockConfiguration;
  console.log(`  BlockPublicAcls:       ${c.BlockPublicAcls}`);
  console.log(`  IgnorePublicAcls:      ${c.IgnorePublicAcls}`);
  console.log(`  BlockPublicPolicy:     ${c.BlockPublicPolicy}        ← #3`);
  console.log(`  RestrictPublicBuckets: ${c.RestrictPublicBuckets}    ← #4 (둘 다 false여야 정책 효과)`);
} catch (e) {
  console.log(`Failed: ${e.name}: ${e.message}`);
}

console.log("");

// 3. List actual objects (sanity check key path)
console.log("=== Recent objects in teachers/ ===");
try {
  const out = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: "teachers/", MaxKeys: 5 }));
  for (const o of out.Contents ?? []) {
    console.log(`  ${o.Key}  (${o.Size} bytes, ${o.LastModified?.toISOString()})`);
    console.log(`    → https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(o.Key)}`);
  }
  if (!out.Contents?.length) console.log("(none)");
} catch (e) {
  console.log(`Failed: ${e.name}: ${e.message}`);
}

console.log("");

// 4. Try unauthenticated GET on first object
console.log("=== Public GET test (no auth) ===");
try {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: "teachers/", MaxKeys: 1 }));
  if (list.Contents?.length) {
    const key = list.Contents[0].Key;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(key)}`;
    const res = await fetch(url);
    console.log(`  GET ${url}`);
    console.log(`  → HTTP ${res.status} ${res.statusText}`);
    if (res.status !== 200) {
      console.log("  → 공개 read 안 풀린 상태. 버킷 정책 또는 BPA 확인 필요.");
    }
  } else {
    console.log("(no objects to test)");
  }
} catch (e) {
  console.log(`Failed: ${e.message}`);
}
