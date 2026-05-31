import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const ALGORITHM = "aes-256-gcm";
const key = Buffer.from(process.env.APP_ENCRYPTION_KEY, "base64");
console.log(`Key bytes: ${key.length} (expect 32)`);

function encrypt(text) {
  const iv = randomBytes(12);
  const c = createCipheriv(ALGORITHM, key, iv);
  const ct = Buffer.concat([c.update(text, "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${ct.toString("base64")}`;
}
function decrypt(payload) {
  if (!payload.startsWith("v1:")) return payload;
  const [, ivB64, tagB64, ctB64] = payload.split(":");
  const d = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  d.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([d.update(Buffer.from(ctB64, "base64")), d.final()]).toString("utf8");
}

for (const sample of ["010-1234-5678", "070-0000-0000", "+82 10 9999 8888"]) {
  const enc = encrypt(sample);
  const dec = decrypt(enc);
  const legacy = decrypt(sample);
  console.log(`plain : ${sample}`);
  console.log(`encrypted : ${enc.slice(0, 80)}...`);
  console.log(`decrypted : ${dec}  ${dec === sample ? "✓" : "✗"}`);
  console.log(`legacy passthrough : ${legacy}  ${legacy === sample ? "✓" : "✗"}`);
  console.log("");
}
