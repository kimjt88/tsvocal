import Link from "next/link";

import { listBeforeAfters } from "@/lib/repositories/before-afters";
import { listClassOfferings } from "@/lib/repositories/class-offerings";
import { listCurriculumSteps } from "@/lib/repositories/curriculum-steps";
import { listTeachingMethods } from "@/lib/repositories/teaching-methods";
import { listWhyFeatures } from "@/lib/repositories/why-features";

import { Card } from "../_components/ui";
import { PageHeader } from "../_components/page-header";

export const dynamic = "force-dynamic";

async function safeCount<T>(p: Promise<T[]>) {
  try {
    return (await p).length;
  } catch {
    return null;
  }
}

const SECTIONS = [
  {
    href: "/admin/programs/why",
    title: "학원 강점 (Why TS)",
    desc: "메인 페이지 'Why TS' 섹션의 6개 카드",
    counter: "why",
  },
  {
    href: "/admin/programs/curriculum",
    title: "Time Save 커리큘럼",
    desc: "Time Save 4단계 커리큘럼 카드",
    counter: "curriculum",
  },
  {
    href: "/admin/programs/classes",
    title: "대상별 반",
    desc: "취미반 / 실력 향상반 / 입시반 카드",
    counter: "classes",
  },
  {
    href: "/admin/programs/teaching",
    title: "수업 방식 (How we teach)",
    desc: "수업은 이렇게 진행돼요 카드",
    counter: "teaching",
  },
  {
    href: "/admin/programs/before-after",
    title: "Before & After",
    desc: "짧은 시간, 분명한 변화 케이스",
    counter: "before-after",
  },
] as const;

export default async function ProgramsHubPage() {
  const [why, curriculum, classes, teaching, beforeAfter] = await Promise.all([
    safeCount(listWhyFeatures()),
    safeCount(listCurriculumSteps()),
    safeCount(listClassOfferings()),
    safeCount(listTeachingMethods()),
    safeCount(listBeforeAfters()),
  ]);
  const counters: Record<string, number | null> = {
    why,
    curriculum,
    classes,
    teaching,
    "before-after": beforeAfter,
  };

  return (
    <>
      <PageHeader
        title="프로그램 관리"
        description="메인 페이지의 프로그램 관련 섹션을 모두 여기서 관리합니다. 각 섹션이 비어 있으면 기본 디자인이 자동으로 표시됩니다."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map((s) => {
          const count = counters[s.counter];
          return (
            <Link
              key={s.href}
              href={s.href}
              className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-900 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
                </div>
                <div className="text-2xl font-semibold text-slate-900 leading-none">
                  {count === null ? "—" : count}
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                {count === null
                  ? "(데이터 불러오기 실패)"
                  : count === 0
                  ? "등록된 항목 없음 — 기본값 표시 중"
                  : `${count}개 등록됨`}
              </div>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6 p-5">
        <div className="text-sm text-slate-700">
          <p className="mb-2">
            <strong>참고:</strong> 각 섹션은 <em>등록된 항목이 0개일 때</em> 디자인 시안의 기본 콘텐츠를
            자동으로 보여줍니다. 하나라도 등록하면 등록된 항목만 노출됩니다.
          </p>
          <p className="text-xs text-slate-500">
            메인 페이지의 다른 영역(메인 배너 · 강사진 · 수강생 리뷰 · 학원 정보)은 좌측 사이드바의 해당 메뉴에서 관리합니다.
          </p>
        </div>
      </Card>
    </>
  );
}
