import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const VERSION = "v1";

let cachedKey: Buffer | null = null;

function key(): Buffer {
  if (cachedKey) return cachedKey;
  const buf = Buffer.from(env.encryptionKey, "base64");
  if (buf.length !== 32) {
    throw new Error(
      `APP_ENCRYPTION_KEY must decode to 32 bytes (got ${buf.length}). Generate with: openssl rand -base64 32`,
    );
  }
  cachedKey = buf;
  return buf;
}

/**
 * Encrypt a plaintext string. Returns a versioned, self-describing token:
 * `v1:<base64 iv>:<base64 authTag>:<base64 ciphertext>`
 *
 * Empty/undefined input is returned as-is (callers can safely encrypt nullable fields).
 */
export function encrypt(plaintext: string | undefined | null): string | undefined {
  if (plaintext == null || plaintext === "") return plaintext ?? undefined;
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}:${iv.toString("base64")}:${tag.toString("base64")}:${ct.toString("base64")}`;
}

/**
 * Decrypt a token produced by `encrypt`. If the input doesn't look encrypted
 * (no version prefix), it's returned as-is — this preserves legacy plaintext data.
 */
export function decrypt(payload: string | undefined | null): string | undefined {
  if (payload == null || payload === "") return payload ?? undefined;
  if (!payload.startsWith(`${VERSION}:`)) return payload; // legacy/plaintext passthrough
  const parts = payload.split(":");
  if (parts.length !== 4) return payload;
  const [, ivB64, tagB64, ctB64] = parts;
  try {
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const ct = Buffer.from(ctB64, "base64");
    const decipher = createDecipheriv(ALGORITHM, key(), iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
  } catch (e) {
    // Auth tag mismatch (wrong key / tampered) — log and surface placeholder
    console.error("decrypt failed", e);
    return "[복호화 실패]";
  }
}
