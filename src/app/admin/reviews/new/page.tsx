import { PageHeader } from "../../_components/page-header";
import { ReviewForm } from "../form";

export default function NewReviewPage() {
  return (
    <>
      <PageHeader
        title="새 리뷰"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/reviews", label: "수강생 리뷰" },
          { href: "/admin/reviews/new", label: "새 리뷰" },
        ]}
      />
      <ReviewForm
        defaults={{
          studentName: "",
          studentInfo: "",
          rating: 5,
          body: "",
          visible: true,
        }}
      />
    </>
  );
}
