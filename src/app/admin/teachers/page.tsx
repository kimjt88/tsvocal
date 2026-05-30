import { listTeachers } from "@/lib/repositories/teachers";

import { Badge, Card, EmptyState, LinkButton } from "../_components/ui";
import { PageHeader } from "../_components/page-header";
import { deleteTeacherAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const items = await listTeachers().catch(() => []);
  return (
    <>
      <PageHeader
        title="강사진"
        description="공개 사이트 강사진 섹션에 노출됩니다."
        action={<LinkButton href="/admin/teachers/new">+ 새 강사</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 강사가 없습니다"
          action={<LinkButton href="/admin/teachers/new">+ 새 강사</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-5 py-3 font-medium">분야</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{t.order}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {t.name}
                    {t.englishName && <span className="text-slate-400"> · {t.englishName}</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{t.role}</td>
                  <td className="px-5 py-3">
                    {t.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/teachers/${t.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteTeacherAction}>
                        <input type="hidden" name="id" value={t.id} />
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
