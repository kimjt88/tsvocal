"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createTeacher,
  deleteTeacher,
  updateTeacher,
  type TeacherInput,
} from "@/lib/repositories/teachers";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
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
  try {
    await updateTeacher(id, input);
  } catch (e) {
    console.error("updateTeacher failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/teachers");
  revalidatePath("/");
  redirect("/admin/teachers");
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteTeacher(id);
  revalidatePath("/admin/teachers");
  revalidatePath("/");
}
