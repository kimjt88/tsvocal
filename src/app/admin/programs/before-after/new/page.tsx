import { PageHeader } from "../../../_components/page-header";
import { BeforeAfterForm } from "../form";

export default function NewBeforeAfterPage() {
  return (
    <>
      <PageHeader
        title="새 Before & After 케이스"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/before-after", label: "Before & After" },
          { href: "/admin/programs/before-after/new", label: "새 케이스" },
        ]}
      />
      <BeforeAfterForm
        defaults={{
          initial: "",
          studentName: "",
          studentInfo: "",
          metrics: [],
          quote: "",
          order: 0,
          active: true,
        }}
      />
    </>
  );
}
