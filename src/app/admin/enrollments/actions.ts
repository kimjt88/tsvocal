"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteEnrollment,
  updateEnrollment,
  type EnrollmentStatus,
} from "@/lib/repositories/enrollments";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

const STATUSES: EnrollmentStatus[] = ["new", "contacted", "booked", "done", "cancelled"];

export async function updateEnrollmentAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const status = String(formData.get("status") ?? "new") as EnrollmentStatus;
  const note = String(formData.get("note") ?? "").trim() || undefined;
  if (!STATUSES.includes(status)) {
    return { error: "잘못된 상태값입니다." };
  }
  try {
    await updateEnrollment(id, { status, note });
  } catch (e) {
    console.error("updateEnrollment failed", e);
    return { error: "저장 실패. 잠시 후 다시 시도해주세요." };
  }
  revalidatePath("/admin/enrollments");
  redirect("/admin/enrollments");
}

export async function deleteEnrollmentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteEnrollment(id);
  revalidatePath("/admin/enrollments");
}
