"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createReview,
  deleteReview,
  updateReview,
  type ReviewInput,
} from "@/lib/repositories/reviews";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): ReviewInput {
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") ?? 5)));
  return {
    studentName: String(formData.get("studentName") ?? "").trim(),
    studentInfo: String(formData.get("studentInfo") ?? "").trim() || undefined,
    rating,
    body: String(formData.get("body") ?? "").trim(),
    visible: formData.get("visible") === "on",
  };
}

export async function createReviewAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.studentName || !input.body) return { error: "이름과 내용은 필수입니다." };
  try {
    await createReview(input);
  } catch (e) {
    console.error("createReview failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function updateReviewAction(
  id: string,
  _p: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.studentName || !input.body) return { error: "이름과 내용은 필수입니다." };
  try {
    await updateReview(id, input);
  } catch (e) {
    console.error("updateReview failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
