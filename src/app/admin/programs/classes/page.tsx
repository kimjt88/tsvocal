import { listClassOfferings } from "@/lib/repositories/class-offerings";

import { Badge, Card, EmptyState, LinkButton } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { deleteClassOfferingAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const items = await listClassOfferings().catch(() => []);
  return (
    <>
      <PageHeader
        title="대상별 반"
        description="메인 페이지 '대상별 반' 카드를 관리합니다."
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/classes", label: "대상별 반" },
        ]}
        action={<LinkButton href="/admin/programs/classes/new">+ 새 반</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 반이 없습니다"
          description="등록 전까지 기본 3개 반(취미반/실력 향상반/입시반)이 표시됩니다."
          action={<LinkButton href="/admin/programs/classes/new">+ 새 반</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">배지</th>
                <th className="px-5 py-3 font-medium">반 이름</th>
                <th className="px-5 py-3 font-medium">추천</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{it.order}</td>
                  <td className="px-5 py-3 text-slate-600">{it.badge}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{it.name}</td>
                  <td className="px-5 py-3">
                    {it.featured ? <Badge tone="warning">추천</Badge> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {it.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/programs/classes/${it.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteClassOfferingAction}>
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
