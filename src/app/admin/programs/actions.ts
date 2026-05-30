"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createProgram,
  deleteProgram,
  updateProgram,
  type ProgramInput,
} from "@/lib/repositories/programs";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): ProgramInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createProgramAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name || !input.description) return { error: "프로그램명과 설명은 필수입니다." };
  try {
    await createProgram(input);
  } catch (e) {
    console.error("createProgram failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect("/admin/programs");
}

export async function updateProgramAction(
  id: string,
  _p: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name || !input.description) return { error: "프로그램명과 설명은 필수입니다." };
  try {
    await updateProgram(id, input);
  } catch (e) {
    console.error("updateProgram failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect("/admin/programs");
}

export async function deleteProgramAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteProgram(id);
  revalidatePath("/admin/programs");
  revalidatePath("/");
}
