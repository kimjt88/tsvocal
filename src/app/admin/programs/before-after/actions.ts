"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBeforeAfter,
  deleteBeforeAfter,
  updateBeforeAfter,
  type BAMetric,
  type BeforeAfterInput,
} from "@/lib/repositories/before-afters";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string };

function parseMetrics(formData: FormData): BAMetric[] {
  const metrics: BAMetric[] = [];
  for (let i = 0; i < 6; i++) {
    const label = String(formData.get(`metric_${i}_label`) ?? "").trim();
    const change = String(formData.get(`metric_${i}_change`) ?? "").trim();
    const before = Number(formData.get(`metric_${i}_before`) ?? 0);
    const after = Number(formData.get(`metric_${i}_after`) ?? 0);
    if (label) {
      metrics.push({
        label,
        change,
        before: Math.max(0, Math.min(100, before || 0)),
        after: Math.max(0, Math.min(100, after || 0)),
      });
    }
  }
  return metrics;
}

function parse(formData: FormData): BeforeAfterInput {
  return {
    initial: String(formData.get("initial") ?? "").trim().slice(0, 2),
    studentName: String(formData.get("studentName") ?? "").trim(),
    studentInfo: String(formData.get("studentInfo") ?? "").trim(),
    metrics: parseMetrics(formData),
    quote: String(formData.get("quote") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createBeforeAfterAction(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.studentName || input.metrics.length === 0) {
    return { error: "수강생 이름과 메트릭(최소 1개) 입력 필요." };
  }
  try {
    await createBeforeAfter(input);
  } catch (e) {
    console.error("createBeforeAfter failed", e);
    return { error: "등록 실패." };
  }
  revalidatePath("/admin/programs/before-after");
  revalidatePath("/");
  redirect("/admin/programs/before-after");
}

export async function updateBeforeAfterAction(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = parse(formData);
  if (!input.studentName || input.metrics.length === 0) {
    return { error: "수강생 이름과 메트릭(최소 1개) 입력 필요." };
  }
  try {
    await updateBeforeAfter(id, input);
  } catch (e) {
    console.error("updateBeforeAfter failed", e);
    return { error: "저장 실패." };
  }
  revalidatePath("/admin/programs/before-after");
  revalidatePath("/");
  redirect("/admin/programs/before-after");
}

export async function deleteBeforeAfterAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteBeforeAfter(id);
  revalidatePath("/admin/programs/before-after");
  revalidatePath("/");
}
