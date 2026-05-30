import { notFound } from "next/navigation";

import { getTeacher } from "@/lib/repositories/teachers";

import { PageHeader } from "../../_components/page-header";
import { TeacherForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTeacher(id);
  if (!t) notFound();
  return (
    <>
      <PageHeader
        title="강사 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/teachers", label: "강사진" },
          { href: `/admin/teachers/${id}`, label: t.name },
        ]}
      />
      <TeacherForm
        id={id}
        defaults={{
          name: t.name,
          englishName: t.englishName ?? "",
          role: t.role,
          bio: t.bio ?? "",
          photoKey: t.photoKey ?? "",
          order: t.order,
          active: t.active,
        }}
      />
    </>
  );
}
