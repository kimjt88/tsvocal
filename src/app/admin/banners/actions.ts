"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBanner,
  deleteBanner,
  getBanner,
  updateBanner,
  type BannerInput,
} from "@/lib/repositories/banners";
import { getSession } from "@/lib/auth";
import { presignUpload, s3 } from "@/lib/s3";
import { env } from "@/lib/env";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type PresignResult =
  | { ok: true; url: string; key: string }
  | { ok: false; error: string };

export async function presignBannerImageAction(
  contentType: string,
  fileSize: number,
): Promise<PresignResult> {
  await requireAdmin();
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return { ok: false, error: "이미지(JPG/PNG/WebP/GIF)만 업로드할 수 있습니다." };
  }
  // 8MB cap for banner — wider/higher-res hero images
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > 8 * 1024 * 1024) {
    return { ok: false, error: "이미지 크기는 8MB 이하여야 합니다." };
  }
  const ext = EXT_BY_TYPE[contentType];
  const key = `banners/${crypto.randomUUID()}.${ext}`;
  try {
    const url = await presignUpload(key, contentType);
    return { ok: true, url, key };
  } catch (e) {
    console.error("presignBannerImageAction failed", e);
    return { ok: false, error: "업로드 URL 발급에 실패했습니다." };
  }
}

async function deleteS3Object(key: string) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: env.s3Bucket, Key: key }));
  } catch (e) {
    console.error("S3 delete failed", key, e);
  }
}

export type FormState = { error?: string };

function parseInput(formData: FormData): BannerInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || undefined,
    kicker: String(formData.get("kicker") ?? "").trim() || undefined,
    imageKey: String(formData.get("imageKey") ?? "").trim() || undefined,
    bgUrl: String(formData.get("bgUrl") ?? "").trim() || undefined,
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim() || undefined,
    ctaHref: String(formData.get("ctaHref") ?? "").trim() || undefined,
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createBannerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parseInput(formData);
  if (!input.title) return { error: "제목은 필수입니다." };
  try {
    await createBanner(input);
  } catch (e) {
    console.error("createBanner failed", e);
    return { error: "등록 실패. 잠시 후 다시 시도해주세요." };
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBannerAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const input = parseInput(formData);
  if (!input.title) return { error: "제목은 필수입니다." };
  let prevImageKey: string | undefined;
  try {
    const existing = await getBanner(id);
    prevImageKey = existing?.imageKey;
    await updateBanner(id, input);
  } catch (e) {
    console.error("updateBanner failed", e);
    return { error: "저장 실패. 잠시 후 다시 시도해주세요." };
  }
  // Clean up orphaned banner image if replaced or removed
  if (prevImageKey && prevImageKey !== input.imageKey) {
    await deleteS3Object(prevImageKey);
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const existing = await getBanner(id).catch(() => null);
  await deleteBanner(id);
  if (existing?.imageKey) {
    await deleteS3Object(existing.imageKey);
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
