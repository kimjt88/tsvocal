import { getAcademy } from "@/lib/repositories/academy";

import { PageHeader } from "../_components/page-header";
import { AcademyForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const academy = await getAcademy().catch(() => null);
  return (
    <>
      <PageHeader title="학원 기본정보" description="공개 사이트 푸터·연락처에 노출되는 정보입니다." />
      <AcademyForm
        defaults={{
          name: academy?.name ?? "TS보컬학원",
          tagline: academy?.tagline ?? "Time Save Vocal",
          address: academy?.address ?? "",
          phone: academy?.phone ?? "",
          hours: academy?.hours ?? "",
          email: academy?.email ?? "",
          naverCafeUrl: academy?.naverCafeUrl ?? "",
          youtubeUrl: academy?.youtubeUrl ?? "",
          instagramUrl: academy?.instagramUrl ?? "",
        }}
      />
    </>
  );
}
