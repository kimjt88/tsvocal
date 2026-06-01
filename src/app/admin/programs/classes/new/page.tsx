import { PageHeader } from "../../../_components/page-header";
import { ClassOfferingForm } from "../form";

export default function NewClassOfferingPage() {
  return (
    <>
      <PageHeader
        title="새 반"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/programs", label: "프로그램 관리" },
          { href: "/admin/programs/classes", label: "대상별 반" },
          { href: "/admin/programs/classes/new", label: "새 반" },
        ]}
      />
      <ClassOfferingForm
        defaults={{
          badge: "",
          name: "",
          forWhom: "",
          features: [],
          frequency: "",
          sessionLength: "",
          featured: false,
          order: 0,
          active: true,
        }}
      />
    </>
  );
}
