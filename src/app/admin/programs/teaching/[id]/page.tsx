import { notFound } from "next/navigation";

import { getTeachingMethod } from "@/lib/repositories/teaching-methods";

import { PageHeader } from "../../../_components/page-header";
import { TeachingMethodForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditTeachingMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getTeachingMethod(id);
  if (!it) notFound();
  return (
    <>
      <PageHeader
        title="수업 방식 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/teaching", label: "수업 방식" },
          { href: `/admin/programs/teaching/${id}`, label: it.title },
        ]}
      />
      <TeachingMethodForm
        id={id}
        defaults={{
          icon: it.icon,
          title: it.title,
          description: it.description,
          order: it.order,
          active: it.active,
        }}
      />
    </>
  );
}
