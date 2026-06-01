import { notFound } from "next/navigation";

import { getWhyFeature } from "@/lib/repositories/why-features";

import { PageHeader } from "../../../_components/page-header";
import { WhyFeatureForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditWhyFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getWhyFeature(id);
  if (!it) notFound();
  return (
    <>
      <PageHeader
        title="학원 강점 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/why", label: "학원 강점" },
          { href: `/admin/programs/why/${id}`, label: it.title },
        ]}
      />
      <WhyFeatureForm
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
