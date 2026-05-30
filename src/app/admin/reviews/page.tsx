import { listReviews } from "@/lib/repositories/reviews";

import { Badge, Card, EmptyState, LinkButton } from "../_components/ui";
import { PageHeader } from "../_components/page-header";
import { deleteReviewAction } from "./actions";

export const dynamic = "force-dynamic";

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

export default async function ReviewsPage() {
  const items = await listReviews().catch(() => []);
  return (
    <>
      <PageHeader
        title="수강생 리뷰"
        description="공개 사이트 후기 섹션에 노출됩니다."
        action={<LinkButton href="/admin/reviews/new">+ 새 리뷰</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="등록된 리뷰가 없습니다"
          action={<LinkButton href="/admin/reviews/new">+ 새 리뷰</LinkButton>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-amber-500 text-sm tracking-widest" aria-label={`${r.rating}점`}>
                    {stars(r.rating)}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {r.studentName}
                    {r.studentInfo && (
                      <span className="text-slate-400 font-normal"> · {r.studentInfo}</span>
                    )}
                  </div>
                </div>
                {r.visible ? <Badge tone="success">노출</Badge> : <Badge>숨김</Badge>}
              </div>
              <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap line-clamp-5">{r.body}</p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <LinkButton href={`/admin/reviews/${r.id}`} variant="secondary">
                  편집
                </LinkButton>
                <form action={deleteReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="h-9 px-3.5 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    삭제
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
