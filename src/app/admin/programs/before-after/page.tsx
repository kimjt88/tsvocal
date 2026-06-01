import { listBeforeAfters } from "@/lib/repositories/before-afters";

import { Badge, Card, EmptyState, LinkButton } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { deleteBeforeAfterAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BeforeAfterPage() {
  const items = await listBeforeAfters().catch(() => []);
  return (
    <>
      <PageHeader
        title="짧은 시간 분명한 변화 (Before & After)"
        description="메인 페이지 'Before & After' 카드를 관리합니다."
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/before-after", label: "Before & After" },
        ]}
        action={<LinkButton href="/admin/programs/before-after/new">+ 새 케이스</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 케이스가 없습니다"
          description="등록 전까지 기본 예시 2개가 표시됩니다."
          action={<LinkButton href="/admin/programs/before-after/new">+ 새 케이스</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">정보</th>
                <th className="px-5 py-3 font-medium">메트릭</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{it.order}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{it.studentName}</td>
                  <td className="px-5 py-3 text-slate-600">{it.studentInfo}</td>
                  <td className="px-5 py-3 text-slate-500">{it.metrics?.length ?? 0}개</td>
                  <td className="px-5 py-3">
                    {it.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/programs/before-after/${it.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteBeforeAfterAction}>
                        <input type="hidden" name="id" value={it.id} />
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
