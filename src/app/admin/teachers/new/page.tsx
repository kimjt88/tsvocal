import { PageHeader } from "../../_components/page-header";
import { TeacherForm } from "../form";

export default function NewTeacherPage() {
  return (
    <>
      <PageHeader
        title="새 강사"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/teachers", label: "강사진" },
          { href: "/admin/teachers/new", label: "새 강사" },
        ]}
      />
      <TeacherForm
        defaults={{
          name: "",
          englishName: "",
          role: "",
          bio: "",
          photoKey: "",
          order: 0,
          active: true,
        }}
      />
    </>
  );
}
