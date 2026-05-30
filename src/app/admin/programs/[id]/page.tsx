import { notFound } from "next/navigation";

import { getProgram } from "@/lib/repositories/programs";

import { PageHeader } from "../../_components/page-header";
import { ProgramForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProgram(id);
  if (!p) notFound();

  return (
    <>
      <PageHeader
        title="프로그램 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램" },
          { href: `/admin/programs/${id}`, label: p.name },
        ]}
      />
      <ProgramForm
        id={id}
        defaults={{
          name: p.name,
          subtitle: p.subtitle ?? "",
          description: p.description,
          order: p.order,
          active: p.active,
        }}
      />
    </>
  );
}
