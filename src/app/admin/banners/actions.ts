"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBanner,
  deleteBanner,
  updateBanner,
  type BannerInput,
} from "@/lib/repositories/banners";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parseInput(formData: FormData): BannerInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || undefined,
    imageKey: String(formData.get("imageKey") ?? "").trim() || undefined,
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
  try {
    await updateBanner(id, input);
  } catch (e) {
    console.error("updateBanner failed", e);
    return { error: "저장 실패. 잠시 후 다시 시도해주세요." };
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteBanner(id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
