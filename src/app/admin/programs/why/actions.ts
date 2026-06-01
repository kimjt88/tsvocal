"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createWhyFeature,
  deleteWhyFeature,
  updateWhyFeature,
  type WhyFeatureInput,
} from "@/lib/repositories/why-features";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): WhyFeatureInput {
  return {
    number: String(formData.get("number") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createWhyFeatureAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await createWhyFeature(input);
  } catch (e) {
    console.error("createWhyFeature failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs/why");
  revalidatePath("/");
  redirect("/admin/programs/why");
}

export async function updateWhyFeatureAction(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await updateWhyFeature(id, input);
  } catch (e) {
    console.error("updateWhyFeature failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs/why");
  revalidatePath("/");
  redirect("/admin/programs/why");
}

export async function deleteWhyFeatureAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteWhyFeature(id);
  revalidatePath("/admin/programs/why");
  revalidatePath("/");
}
