import { listBanners } from "@/lib/repositories/banners";

import { Badge, Card, EmptyState, LinkButton } from "../_components/ui";
import { PageHeader } from "../_components/page-header";
import { deleteBannerAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const banners = await listBanners().catch(() => []);

  return (
    <>
      <PageHeader
        title="메인 배너"
        description="공개 사이트 히어로 슬라이드에 노출됩니다."
        action={<LinkButton href="/admin/banners/new">+ 새 배너</LinkButton>}
      />

      {banners.length === 0 ? (
        <EmptyState
          title="등록된 배너가 없습니다"
          description="첫 배너를 등록해주세요."
          action={<LinkButton href="/admin/banners/new">+ 새 배너</LinkButton>}
        />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">순서</th>
                <th className="px-5 py-3 font-medium">제목</th>
                <th className="px-5 py-3 font-medium">서브타이틀</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium w-1"></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className="border-b last:border-0 border-slate-100">
                  <td className="px-5 py-3 text-slate-500">{b.order}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{b.title}</td>
                  <td className="px-5 py-3 text-slate-600">{b.subtitle ?? "—"}</td>
                  <td className="px-5 py-3">
                    {b.active ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <LinkButton href={`/admin/banners/${b.id}`} variant="secondary">
                        편집
                      </LinkButton>
                      <form action={deleteBannerAction}>
                        <input type="hidden" name="id" value={b.id} />
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
