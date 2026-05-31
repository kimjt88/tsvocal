import { notFound } from "next/navigation";

import { getEnrollment } from "@/lib/repositories/enrollments";

import { Card } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { EnrollmentForm } from "../form";

export const dynamic = "force-dynamic";

const GENDER_LABEL: Record<string, string> = {
  female: "여성",
  male: "남성",
  other: "응답 안 함",
};

const PURPOSE_LABEL: Record<string, string> = {
  hobby: "취미",
  skill: "실력 향상",
  admission: "입시 준비",
  pro: "프로 활동",
  other: "기타",
};

export default async function EnrollmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await getEnrollment(id);
  if (!e) notFound();

  return (
    <>
      <PageHeader
        title="수강 신청 상세"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/enrollments", label: "수강 신청" },
          { href: `/admin/enrollments/${id}`, label: e.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-3">신청자 정보</div>
          <dl className="space-y-2 text-sm">
            <Row k="이름" v={e.name} />
            <Row k="연락처" v={e.phone} />
            <Row k="연령" v={e.age ?? "—"} />
            <Row k="성별" v={GENDER_LABEL[e.gender ?? ""] ?? e.gender ?? "—"} />
            {e.email && <Row k="이메일" v={e.email} />}
            <Row k="개인정보 동의" v={e.consent ? "동의" : "미동의"} />
          </dl>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-3">레슨 요청 사항</div>
          <dl className="space-y-2 text-sm">
            <Row
              k="레슨 목적"
              v={
                e.lessonPurpose
                  ? (PURPOSE_LABEL[e.lessonPurpose] ?? e.lessonPurpose)
                  : (e.programName ?? "—")
              }
            />
            <Row k="희망 시간" v={e.preferredLessonTime ?? "—"} />
            <Row k="선호 장르" v={e.musicGenre ?? "—"} />
            {e.message?.trim() && (
              <div className="pt-2 border-t border-slate-100">
                <dt className="text-slate-500 mb-1 text-xs">기타 메시지</dt>
                <dd className="text-slate-700 whitespace-pre-wrap">{e.message}</dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      <EnrollmentForm id={id} defaults={{ status: e.status, note: e.note ?? "" }} />
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex">
      <dt className="w-28 text-slate-500">{k}</dt>
      <dd className="text-slate-900">{v}</dd>
    </div>
  );
}
