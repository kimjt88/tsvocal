import { notFound } from "next/navigation";

import { getBanner } from "@/lib/repositories/banners";

import { PageHeader } from "../../_components/page-header";
import { BannerForm } from "../form";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getBanner(id);
  if (!banner) notFound();

  return (
    <>
      <PageHeader
        title="배너 편집"
        crumbs={[
          { href: "/admin", label: "대시보드" },
          { href: "/admin/banners", label: "메인 배너" },
          { href: `/admin/banners/${id}`, label: banner.title },
        ]}
      />
      <BannerForm
        id={id}
        defaults={{
          title: banner.title,
          subtitle: banner.subtitle ?? "",
          kicker: banner.kicker ?? "",
          imageKey: banner.imageKey ?? "",
          bgUrl: banner.bgUrl ?? "",
          ctaLabel: banner.ctaLabel ?? "",
          ctaHref: banner.ctaHref ?? "",
          order: banner.order,
          active: banner.active,
        }}
      />
    </>
  );
}
