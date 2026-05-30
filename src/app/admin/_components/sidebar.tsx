"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "대시보드", icon: "▦" },
  { href: "/admin/academy", label: "학원 기본정보", icon: "🏫" },
  { href: "/admin/banners", label: "메인 배너", icon: "🖼" },
  { href: "/admin/enrollments", label: "수강 신청", icon: "📥" },
  { href: "/admin/programs", label: "프로그램", icon: "🎼" },
  { href: "/admin/teachers", label: "강사진", icon: "👥" },
  { href: "/admin/reviews", label: "수강생 리뷰", icon: "★" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="px-6 py-5 border-b border-slate-200">
        <Link href="/admin" className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-slate-900">TS보컬학원</span>
          <span className="text-xs text-slate-500 mt-0.5">Admin Console</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((it) => {
          const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition " +
                (active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100")
              }
            >
              <span className="w-5 text-center">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-900 transition"
          target="_blank"
        >
          ↗ 공개 사이트 보기
        </Link>
      </div>
    </aside>
  );
}
