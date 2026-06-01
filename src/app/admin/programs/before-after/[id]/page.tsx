import { notFound } from "next/navigation";

import { getBeforeAfter } from "@/lib/repositories/before-afters";

import { PageHeader } from "../../../_components/page-header";
import { BeforeAfterForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditBeforeAfterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getBeforeAfter(id);
  if (!it) notFound();
  return (
    <>
      <PageHeader
        title="Before & After 케이스 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/before-after", label: "Before & After" },
          { href: `/admin/programs/before-after/${id}`, label: it.studentName },
        ]}
      />
      <BeforeAfterForm
        id={id}
        defaults={{
          initial: it.initial,
          studentName: it.studentName,
          studentInfo: it.studentInfo,
          metrics: it.metrics ?? [],
          quote: it.quote,
          order: it.order,
          active: it.active,
        }}
      />
    </>
  );
}
