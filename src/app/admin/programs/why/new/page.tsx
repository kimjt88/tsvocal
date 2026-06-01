import { PageHeader } from "../../../_components/page-header";
import { WhyFeatureForm } from "../form";

export default function NewWhyFeaturePage() {
  return (
    <>
      <PageHeader
        title="새 학원 강점"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/why", label: "학원 강점" },
          { href: "/admin/programs/why/new", label: "새 항목" },
        ]}
      />
      <WhyFeatureForm defaults={{ number: "", title: "", description: "", order: 0, active: true }} />
    </>
  );
}
