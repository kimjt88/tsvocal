import { redirect } from "next/navigation";

import { hasAnyAdmin } from "@/lib/admins";

import { SetupForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const seeded = await hasAnyAdmin().catch(() => false);
  if (seeded) redirect("/admin/login");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">최초 관리자 계정 생성</h1>
          <p className="text-sm text-slate-500 mt-1">
            관리자 계정이 아직 없습니다. 첫 계정을 생성해주세요.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
