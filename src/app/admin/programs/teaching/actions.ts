"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createTeachingMethod,
  deleteTeachingMethod,
  updateTeachingMethod,
  type TeachingMethodInput,
} from "@/lib/repositories/teaching-methods";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): TeachingMethodInput {
  return {
    icon: String(formData.get("icon") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createTeachingMethodAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await createTeachingMethod(input);
  } catch (e) {
    console.error("createTeachingMethod failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs/teaching");
  revalidatePath("/");
  redirect("/admin/programs/teaching");
}

export async function updateTeachingMethodAction(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await updateTeachingMethod(id, input);
  } catch (e) {
    console.error("updateTeachingMethod failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs/teaching");
  revalidatePath("/");
  redirect("/admin/programs/teaching");
}

export async function deleteTeachingMethodAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteTeachingMethod(id);
  revalidatePath("/admin/programs/teaching");
  revalidatePath("/");
}
