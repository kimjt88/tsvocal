import { notFound } from "next/navigation";

import { getCurriculumStep } from "@/lib/repositories/curriculum-steps";

import { PageHeader } from "../../../_components/page-header";
import { CurriculumStepForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditCurriculumStepPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getCurriculumStep(id);
  if (!it) notFound();
  return (
    <>
      <PageHeader
        title="커리큘럼 단계 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/curriculum", label: "커리큘럼" },
          { href: `/admin/programs/curriculum/${id}`, label: it.title },
        ]}
      />
      <CurriculumStepForm
        id={id}
        defaults={{
          number: it.number,
          title: it.title,
          description: it.description,
          order: it.order,
          active: it.active,
        }}
      />
    </>
  );
}
