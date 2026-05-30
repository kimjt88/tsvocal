import { notFound } from "next/navigation";

import { getEnrollment } from "@/lib/repositories/enrollments";

import { Card } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { EnrollmentForm } from "../form";

export const dynamic = "force-dynamic";

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
            <Row k="이메일" v={e.email ?? "—"} />
            <Row k="관심 프로그램" v={e.programName ?? "—"} />
          </dl>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-3">메시지</div>
          <p className="text-sm whitespace-pre-wrap text-slate-700">
            {e.message?.trim() ? e.message : <span className="text-slate-400">메시지 없음</span>}
          </p>
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
