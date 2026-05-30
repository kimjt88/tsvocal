import { PageHeader } from "../../_components/page-header";
import { ProgramForm } from "../form";

export default function NewProgramPage() {
  return (
    <>
      <PageHeader
        title="새 프로그램"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램" },
          { href: "/admin/programs/new", label: "새 프로그램" },
        ]}
      />
      <ProgramForm
        defaults={{ name: "", subtitle: "", description: "", order: 0, active: true }}
      />
    </>
  );
}
