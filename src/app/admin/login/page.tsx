import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { hasAnyAdmin } from "@/lib/admins";

import { LoginForm } from "./form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const seeded = await hasAnyAdmin().catch(() => true);
  if (!seeded) redirect("/admin/setup");

  const { next } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">TS보컬학원 관리자</h1>
          <p className="text-sm text-slate-500 mt-1">관리자 계정으로 로그인하세요.</p>
        </div>
        <LoginForm nextPath={next ?? "/admin"} />
        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-700 transition">
            ← 공개 사이트로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
