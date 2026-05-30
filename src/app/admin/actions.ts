"use server";

import { redirect } from "next/navigation";

import {
  clearSessionCookie,
  setSessionCookie,
  signSession,
} from "@/lib/auth";
import {
  createAdmin,
  getAdmin,
  hasAnyAdmin,
  verifyPassword,
} from "@/lib/admins";

export type FormState = { error?: string };

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해주세요." };
  }

  let admin;
  try {
    admin = await getAdmin(username);
  } catch (e) {
    console.error("getAdmin failed", e);
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  if (!admin) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = await signSession({ sub: admin.username, role: "admin" });
  await setSessionCookie(token);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function setupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (username.length < 3) return { error: "아이디는 3자 이상이어야 합니다." };
  if (password.length < 8) return { error: "비밀번호는 8자 이상이어야 합니다." };
  if (password !== confirm) return { error: "비밀번호 확인이 일치하지 않습니다." };

  try {
    if (await hasAnyAdmin()) {
      return { error: "이미 관리자 계정이 존재합니다. 로그인 페이지를 사용해주세요." };
    }
    await createAdmin(username, password);
  } catch (e) {
    console.error("setup failed", e);
    return { error: "관리자 계정을 생성하지 못했습니다. 잠시 후 다시 시도해주세요." };
  }

  const token = await signSession({ sub: username, role: "admin" });
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
