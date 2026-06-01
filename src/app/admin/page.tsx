import Link from "next/link";

import { listBanners } from "@/lib/repositories/banners";
import { listEnrollments } from "@/lib/repositories/enrollments";
import { listBeforeAfters } from "@/lib/repositories/before-afters";
import { listClassOfferings } from "@/lib/repositories/class-offerings";
import { listCurriculumSteps } from "@/lib/repositories/curriculum-steps";
import { listTeachingMethods } from "@/lib/repositories/teaching-methods";
import { listWhyFeatures } from "@/lib/repositories/why-features";
import { listReviews } from "@/lib/repositories/reviews";
import { listTeachers } from "@/lib/repositories/teachers";

import { Card } from "./_components/ui";
import { PageHeader } from "./_components/page-header";

export const dynamic = "force-dynamic";

async function safeCount<T>(p: Promise<T[]>) {
  try {
    return (await p).length;
  } catch {
    return null;
  }
}

const TILES = [
  { href: "/admin/academy", label: "학원 기본정보", desc: "주소·연락처·운영시간" },
  { href: "/admin/banners", label: "메인 배너", desc: "히어로 슬라이드 관리" },
  { href: "/admin/enrollments", label: "수강 신청", desc: "신청서 접수 현황" },
  { href: "/admin/programs", label: "프로그램 관리", desc: "강점/커리큘럼/반/수업방식/Before&After" },
  { href: "/admin/teachers", label: "강사진", desc: "강사 프로필" },
  { href: "/admin/reviews", label: "수강생 리뷰", desc: "후기 노출 관리" },
] as const;

export default async function AdminHome() {
  const [banners, enrollments, why, curriculum, classes, teaching, beforeAfter, teachers, reviews] = await Promise.all([
    safeCount(listBanners()),
    safeCount(listEnrollments()),
    safeCount(listWhyFeatures()),
    safeCount(listCurriculumSteps()),
    safeCount(listClassOfferings()),
    safeCount(listTeachingMethods()),
    safeCount(listBeforeAfters()),
    safeCount(listTeachers()),
    safeCount(listReviews()),
  ]);
  const programsTotal = [why, curriculum, classes, teaching, beforeAfter].reduce<number | null>(
    (sum, v) => (sum === null || v === null ? null : sum + v),
    0,
  );

  const stats = [
    { label: "배너", value: banners },
    { label: "수강 신청", value: enrollments },
    { label: "프로그램", value: programsTotal },
    { label: "강사", value: teachers },
    { label: "리뷰", value: reviews },
  ];

  return (
    <>
      <PageHeader title="대시보드" description="사이트 콘텐츠 현황을 한눈에 확인합니다." />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="text-2xl font-semibold text-slate-900 mt-1">
              {s.value === null ? "—" : s.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-900 hover:shadow-sm transition"
          >
            <div className="text-sm font-medium text-slate-900">{t.label}</div>
            <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
