"use server";

import { revalidatePath } from "next/cache";

import { saveAcademy } from "@/lib/repositories/academy";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string; ok?: boolean };

export async function saveAcademyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const naverCafeUrl = String(formData.get("naverCafeUrl") ?? "").trim() || undefined;
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim() || undefined;
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim() || undefined;

  if (!name || !address || !phone) {
    return { error: "학원명·주소·전화는 필수입니다." };
  }

  try {
    await saveAcademy({ name, tagline, address, phone, hours, email, naverCafeUrl, youtubeUrl, instagramUrl });
  } catch (e) {
    console.error("saveAcademy failed", e);
    return { error: "저장에 실패했습니다." };
  }

  revalidatePath("/admin/academy");
  revalidatePath("/");
  return { ok: true };
}
