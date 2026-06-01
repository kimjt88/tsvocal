import { PageHeader } from "../../../_components/page-header";
import { TeachingMethodForm } from "../form";

export default function NewTeachingMethodPage() {
  return (
    <>
      <PageHeader
        title="새 수업 방식"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/teaching", label: "수업 방식" },
          { href: "/admin/programs/teaching/new", label: "새 항목" },
        ]}
      />
      <TeachingMethodForm defaults={{ icon: "", title: "", description: "", order: 0, active: true }} />
    </>
  );
}
