import { notFound } from "next/navigation";

import { getClassOffering } from "@/lib/repositories/class-offerings";

import { PageHeader } from "../../../_components/page-header";
import { ClassOfferingForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditClassOfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getClassOffering(id);
  if (!it) notFound();
  return (
    <>
      <PageHeader
        title="반 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/classes", label: "대상별 반" },
          { href: `/admin/programs/classes/${id}`, label: it.name },
        ]}
      />
      <ClassOfferingForm
        id={id}
        defaults={{
          badge: it.badge,
          name: it.name,
          forWhom: it.forWhom,
          features: it.features ?? [],
          frequency: it.frequency,
          sessionLength: it.sessionLength,
          featured: it.featured,
          order: it.order,
          active: it.active,
        }}
      />
    </>
  );
}
