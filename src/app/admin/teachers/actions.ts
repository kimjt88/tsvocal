"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  updateTeacher,
  type TeacherInput,
} from "@/lib/repositories/teachers";
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

export async function presignTeacherPhotoAction(
  contentType: string,
  fileSize: number,
): Promise<PresignResult> {
  await requireAdmin();
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return { ok: false, error: "이미지(JPG/PNG/WebP/GIF)만 업로드할 수 있습니다." };
  }
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > 5 * 1024 * 1024) {
    return { ok: false, error: "이미지 크기는 5MB 이하여야 합니다." };
  }
  const ext = EXT_BY_TYPE[contentType];
  const key = `teachers/${crypto.randomUUID()}.${ext}`;
  try {
    const url = await presignUpload(key, contentType);
    return { ok: true, url, key };
  } catch (e) {
    console.error("presignTeacherPhotoAction failed", e);
    return { ok: false, error: "업로드 URL 발급에 실패했습니다." };
  }
}

async function deleteS3Object(key: string) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: env.s3Bucket, Key: key }));
  } catch (e) {
    // Non-fatal — log and continue. Orphan files can be cleaned up later.
    console.error("S3 delete failed", key, e);
  }
}

export type FormState = { error?: string };

function parse(formData: FormData): TeacherInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    englishName: String(formData.get("englishName") ?? "").trim() || undefined,
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim() || undefined,
    photoKey: String(formData.get("photoKey") ?? "").trim() || undefined,
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createTeacherAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name || !input.role) return { error: "이름과 분야는 필수입니다." };
  try {
    await createTeacher(input);
  } catch (e) {
    console.error("createTeacher failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/teachers");
  revalidatePath("/");
  redirect("/admin/teachers");
}

export async function updateTeacherAction(
  id: string,
  _p: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name || !input.role) return { error: "이름과 분야는 필수입니다." };
  let prevPhotoKey: string | undefined;
  try {
    const existing = await getTeacher(id);
    prevPhotoKey = existing?.photoKey;
    await updateTeacher(id, input);
  } catch (e) {
    console.error("updateTeacher failed", e);
    return { error: "저장 실패." };
  }
  // Clean up orphaned photo if it was replaced or removed
  if (prevPhotoKey && prevPhotoKey !== input.photoKey) {
    await deleteS3Object(prevPhotoKey);
  }
  revalidatePath("/admin/teachers");
  revalidatePath("/");
  redirect("/admin/teachers");
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const existing = await getTeacher(id).catch(() => null);
  await deleteTeacher(id);
  if (existing?.photoKey) {
    await deleteS3Object(existing.photoKey);
  }
  revalidatePath("/admin/teachers");
  revalidatePath("/");
}
