"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEnrollment } from "@/lib/repositories/enrollments";

export type ApplyFormState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      | "name"
      | "phone"
      | "age"
      | "gender"
      | "lessonPurpose"
      | "consent",
      string
    >
  >;
};

const ALLOWED_GENDERS = new Set(["female", "male", "other"]);
const ALLOWED_PURPOSES = new Set(["hobby", "skill", "admission", "pro", "other"]);

export async function submitApplyAction(
  _prev: ApplyFormState,
  formData: FormData,
): Promise<ApplyFormState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 50);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 30);
  const age = String(formData.get("age") ?? "").trim().slice(0, 30);
  const gender = String(formData.get("gender") ?? "").trim();
  const lessonPurpose = String(formData.get("lessonPurpose") ?? "").trim();
  const preferredLessonTime = String(formData.get("preferredLessonTime") ?? "").trim().slice(0, 50);
  const musicGenre = String(formData.get("musicGenre") ?? "").trim().slice(0, 200);
  const consent = formData.get("consent") === "on";

  const fieldErrors: ApplyFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "이름을 입력해주세요.";
  if (!phone) fieldErrors.phone = "연락처를 입력해주세요.";
  else if (!/^[\d\-+\s()]{7,}$/.test(phone)) fieldErrors.phone = "유효한 연락처 형식이 아닙니다.";
  if (!age) fieldErrors.age = "연령을 선택해주세요.";
  if (!gender || !ALLOWED_GENDERS.has(gender)) fieldErrors.gender = "성별을 선택해주세요.";
  if (!lessonPurpose || !ALLOWED_PURPOSES.has(lessonPurpose))
    fieldErrors.lessonPurpose = "레슨 목적을 선택해주세요.";
  if (!consent) fieldErrors.consent = "개인정보 수집·이용에 동의해주세요.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await createEnrollment({
      name,
      phone,
      age,
      gender,
      lessonPurpose,
      preferredLessonTime: preferredLessonTime || undefined,
      musicGenre: musicGenre || undefined,
      consent,
      status: "new",
    });
  } catch (e) {
    console.error("submitApplyAction failed", e);
    return { error: "신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/admin/enrollments");
  redirect("/apply/success");
}
