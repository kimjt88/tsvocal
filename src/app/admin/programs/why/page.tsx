import { listWhyFeatures } from "@/lib/repositories/why-features";

import { Badge, Card, EmptyState, LinkButton } from "../../_components/ui";
import { PageHeader } from "../../_components/page-header";
import { deleteWhyFeatureAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function WhyFeaturesPage() {
  const items = await listWhyFeatures().catch(() => []);
  return (
    <>
      <PageHeader
        title="학원 강점 (Why TS)"
        description="메인 페이지 'Why TS' 섹션의 6개 카드를 관리합니다."
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/why", label: "학원 강점" },
        ]}
        action={<LinkButton href="/admin/programs/why/new">+ 새 항목</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 항목이 없습니다"
          description="등록 전까지는 메인 페이지에 기본 6개 카드(Time Save 커리큘럼, 담임 강사 시스템 등)가 표시됩니다."
          action={<LinkButton href="/admin/programs/why/new">+ 새 항목</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">번호</th>
                <th className="px-5 py-3 font-medium">제목</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{it.order}</td>
                  <td className="px-5 py-3 text-slate-600">{it.number}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{it.title}</td>
                  <td className="px-5 py-3">
                    {it.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/programs/why/${it.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteWhyFeatureAction}>
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
