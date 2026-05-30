import type { Metadata } from "next";

import { getSession } from "@/lib/auth";

import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TS보컬학원 — 관리자",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className="admin-shell min-h-screen flex font-sans text-slate-900 antialiased">
      {session ? (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar username={session.sub} />
            <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">{children}</main>
          </div>
        </>
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
}
