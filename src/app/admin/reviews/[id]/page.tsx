import { notFound } from "next/navigation";

import { getReview } from "@/lib/repositories/reviews";

import { PageHeader } from "../../_components/page-header";
import { ReviewForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getReview(id);
  if (!r) notFound();
  return (
    <>
      <PageHeader
        title="리뷰 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/reviews", label: "수강생 리뷰" },
          { href: `/admin/reviews/${id}`, label: r.studentName },
        ]}
      />
      <ReviewForm
        id={id}
        defaults={{
          studentName: r.studentName,
          studentInfo: r.studentInfo ?? "",
          rating: r.rating,
          body: r.body,
          visible: r.visible,
        }}
      />
    </>
  );
}
