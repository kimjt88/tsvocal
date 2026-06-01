import { PageHeader } from "../../../_components/page-header";
import { CurriculumStepForm } from "../form";

export default function NewCurriculumStepPage() {
  return (
    <>
      <PageHeader
        title="새 커리큘럼 단계"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/curriculum", label: "커리큘럼" },
          { href: "/admin/programs/curriculum/new", label: "새 단계" },
        ]}
      />
      <CurriculumStepForm defaults={{ number: "", title: "", description: "", order: 0, active: true }} />
    </>
  );
}
