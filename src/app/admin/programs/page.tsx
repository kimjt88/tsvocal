import { listPrograms } from "@/lib/repositories/programs";

import { Badge, Card, EmptyState, LinkButton } from "../_components/ui";
import { PageHeader } from "../_components/page-header";
import { deleteProgramAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const items = await listPrograms().catch(() => []);
  return (
    <>
      <PageHeader
        title="프로그램"
        description="공개 사이트 프로그램 섹션에 노출됩니다."
        action={<LinkButton href="/admin/programs/new">+ 새 프로그램</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 프로그램이 없습니다"
          action={<LinkButton href="/admin/programs/new">+ 새 프로그램</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">서브타이틀</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{p.order}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-5 py-3 text-slate-600">{p.subtitle ?? "—"}</td>
                  <td className="px-5 py-3">
                    {p.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/programs/${p.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteProgramAction}>
                        <input type="hidden" name="id" value={p.id} />
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
