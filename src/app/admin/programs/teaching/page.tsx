import { listTeachingMethods } from "@/lib/repositories/teaching-methods";

import { Badge, Card, EmptyState, LinkButton } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { deleteTeachingMethodAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeachingPage() {
  const items = await listTeachingMethods().catch(() => []);
  return (
    <>
      <PageHeader
        title="수업 방식 (How we teach)"
        description="메인 페이지 '수업은 이렇게 진행돼요' 카드를 관리합니다."
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/teaching", label: "수업 방식" },
        ]}
        action={<LinkButton href="/admin/programs/teaching/new">+ 새 항목</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 항목이 없습니다"
          description="등록 전까지 기본 4개 카드(1:1 / 매 수업 녹음 / 연습실 / 담임 책임)가 표시됩니다."
          action={<LinkButton href="/admin/programs/teaching/new">+ 새 항목</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">아이콘</th>
                <th className="px-5 py-3 font-medium">제목</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{it.order}</td>
                  <td className="px-5 py-3 text-lg">{it.icon}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{it.title}</td>
                  <td className="px-5 py-3">
                    {it.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/programs/teaching/${it.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteTeachingMethodAction}>
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
