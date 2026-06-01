"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createClassOffering,
  deleteClassOffering,
  updateClassOffering,
  type ClassOfferingInput,
} from "@/lib/repositories/class-offerings";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parse(formData: FormData): ClassOfferingInput {
  const featuresRaw = String(formData.get("features") ?? "");
  const features = featuresRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    badge: String(formData.get("badge") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    forWhom: String(formData.get("forWhom") ?? "").trim(),
    features,
    frequency: String(formData.get("frequency") ?? "").trim(),
    sessionLength: String(formData.get("sessionLength") ?? "").trim(),
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createClassOfferingAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name) return { error: "반 이름은 필수입니다." };
  try {
    await createClassOffering(input);
  } catch (e) {
    console.error("createClassOffering failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs/classes");
  revalidatePath("/");
  redirect("/admin/programs/classes");
}

export async function updateClassOfferingAction(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name) return { error: "반 이름은 필수입니다." };
  try {
    await updateClassOffering(id, input);
  } catch (e) {
    console.error("updateClassOffering failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs/classes");
  revalidatePath("/");
  redirect("/admin/programs/classes");
}

export async function deleteClassOfferingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteClassOffering(id);
  revalidatePath("/admin/programs/classes");
  revalidatePath("/");
}
