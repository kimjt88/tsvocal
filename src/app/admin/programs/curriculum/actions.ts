"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createCurriculumStep,
  deleteCurriculumStep,
  updateCurriculumStep,
  type CurriculumStepInput,
} from "@/lib/repositories/curriculum-steps";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): CurriculumStepInput {
  return {
    number: String(formData.get("number") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createCurriculumStepAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await createCurriculumStep(input);
  } catch (e) {
    console.error("createCurriculumStep failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs/curriculum");
  revalidatePath("/");
  redirect("/admin/programs/curriculum");
}

export async function updateCurriculumStepAction(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.title || !input.description) return { error: "제목과 설명은 필수입니다." };
  try {
    await updateCurriculumStep(id, input);
  } catch (e) {
    console.error("updateCurriculumStep failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs/curriculum");
  revalidatePath("/");
  redirect("/admin/programs/curriculum");
}

export async function deleteCurriculumStepAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteCurriculumStep(id);
  revalidatePath("/admin/programs/curriculum");
  revalidatePath("/");
}
