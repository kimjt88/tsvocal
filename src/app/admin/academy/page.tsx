import { getAcademy } from "@/lib/repositories/academy";

import { PageHeader } from "../_components/page-header";
import { AcademyForm } from "./form";

export const dynamic = "force-dynamic";

function buildKakaoSnippet(timestamp: string, key: string) {
  return `<div id="daumRoughmapContainer${timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div>
<script charset="UTF-8" class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script>
<script charset="UTF-8">
    new daum.roughmap.Lander({
        "timestamp" : "${timestamp}",
        "key" : "${key}",
        "mapWidth" : "640",
        "mapHeight" : "360"
    }).render();
</script>`;
}

export default async function AcademyPage() {
  const academy = await getAcademy().catch(() => null);
  const mapDefault =
    academy?.mapKakaoRoughKey && academy?.mapKakaoRoughTimestamp
      ? buildKakaoSnippet(academy.mapKakaoRoughTimestamp, academy.mapKakaoRoughKey)
      : (academy?.mapEmbedUrl ?? "");
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
          mapEmbedUrl: mapDefault,
        }}
      />
    </>
  );
}
