import { listEnrollments, type EnrollmentStatus } from "@/lib/repositories/enrollments";

import { Badge, Card, EmptyState, LinkButton } from "../_components/ui";
import { PageHeader } from "../_components/page-header";
import { deleteEnrollmentAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  new: "신규",
  contacted: "연락 완료",
  booked: "예약 완료",
  done: "수강 시작",
  cancelled: "취소",
};

const STATUS_TONE: Record<EnrollmentStatus, "neutral" | "success" | "warning" | "danger"> = {
  new: "warning",
  contacted: "neutral",
  booked: "success",
  done: "success",
  cancelled: "danger",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}

export default async function EnrollmentsPage() {
  const items = await listEnrollments().catch(() => []);

  return (
    <>
      <PageHeader title="수강 신청" description="공개 사이트에서 접수된 신청서 목록입니다." />

      {items.length === 0 ? (
        <EmptyState
          title="접수된 신청이 없습니다"
          description="공개 사이트 문의 폼이 연결되면 여기에 표시됩니다."
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">접수</th>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">연락처</th>
                <th className="px-5 py-3 font-medium">관심 프로그램</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{fmt(e.createdAt)}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{e.name}</td>
                  <td className="px-5 py-3 text-slate-700">{e.phone}</td>
                  <td className="px-5 py-3 text-slate-600">{e.programName ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Badge tone={STATUS_TONE[e.status]}>{STATUS_LABEL[e.status]}</Badge>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/enrollments/${e.id}`} variant="secondary">
                        상세
                      </LinkButton>
                      <form action={deleteEnrollmentAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <button
                          type="submit"
                          className="h-9 px-3.5 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
