"use server";

import { revalidatePath } from "next/cache";

import { saveAcademy } from "@/lib/repositories/academy";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("unauthenticated");
}

export type FormState = { error?: string; ok?: boolean };

export async function saveAcademyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const naverCafeUrl = String(formData.get("naverCafeUrl") ?? "").trim() || undefined;
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim() || undefined;
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim() || undefined;
  const mapEmbedRaw = String(formData.get("mapEmbedUrl") ?? "").trim();
  let mapEmbedUrl: string | undefined;
  let mapKakaoRoughKey: string | undefined;
  let mapKakaoRoughTimestamp: string | undefined;

  if (mapEmbedRaw) {
    // Try Kakao "지도 퍼가기" snippet first — extract timestamp + key from the Lander config
    const tsMatch = mapEmbedRaw.match(/["']timestamp["']\s*:\s*["'](\d+)["']/);
    const keyMatch = mapEmbedRaw.match(/["']key["']\s*:\s*["']([a-z0-9]+)["']/i);
    if (tsMatch && keyMatch) {
      mapKakaoRoughTimestamp = tsMatch[1];
      mapKakaoRoughKey = keyMatch[1];
    } else {
      // Fall back to iframe src or bare URL
      const iframeSrc = mapEmbedRaw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1];
      const candidate = iframeSrc ?? mapEmbedRaw;
      const isAllowed =
        /^https:\/\/(www\.|m\.)?map\.naver\.com\//i.test(candidate) ||
        candidate.startsWith("https://naver.me/") ||
        /^https:\/\/(map\.|place\.)?kakao\.com\//i.test(candidate) ||
        /^https:\/\/(www\.)?google\.com\/maps\//i.test(candidate);
      if (!isAllowed) {
        return {
          error:
            "지도 임베드는 카카오 ‘지도 퍼가기’ 코드(권장) 또는 구글/카카오/네이버 지도의 iframe·https URL이어야 합니다.",
        };
      }
      mapEmbedUrl = candidate;
    }
  }

  if (!name || !address || !phone) {
    return { error: "학원명·주소·전화는 필수입니다." };
  }

  try {
    await saveAcademy({
      name,
      tagline,
      address,
      phone,
      hours,
      email,
      naverCafeUrl,
      youtubeUrl,
      instagramUrl,
      mapEmbedUrl,
      mapKakaoRoughKey,
      mapKakaoRoughTimestamp,
    });
  } catch (e) {
    console.error("saveAcademy failed", e);
    return { error: "저장에 실패했습니다." };
  }

  revalidatePath("/admin/academy");
  revalidatePath("/");
  return { ok: true };
}
