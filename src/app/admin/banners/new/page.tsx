import { PageHeader } from "../../_components/page-header";
import { BannerForm } from "../form";

export default function NewBannerPage() {
  return (
    <>
      <PageHeader
        title="새 배너"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/banners", label: "메인 배너" },
          { href: "/admin/banners/new", label: "새 배너" },
        ]}
      />
      <BannerForm
        defaults={{
          title: "",
          subtitle: "",
          imageKey: "",
          ctaLabel: "",
          ctaHref: "",
          order: 0,
          active: true,
        }}
      />
    </>
  );
}
