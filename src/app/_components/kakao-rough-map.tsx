"use client";

/**
 * Render the Kakao "지도 퍼가기" map inside an isolated iframe via srcDoc.
 *
 * Why: the official Kakao loader (roughmapLoader.js) injects the real Lander
 * script via `document.write()`. document.write is a no-op once the document
 * has finished parsing — which is always the case in a Next.js client component.
 * Hosting the snippet inside its own iframe gives it a brand-new document that
 * IS in the parsing phase, so document.write works naturally. Each React mount
 * creates a fresh iframe → fresh document → predictable behavior across
 * SPA back/forward navigation.
 *
 * Costs:
 * - Each mount re-fetches roughmapLoader.js (~0.5KB) and roughmapLander.js
 *   (~128KB), both served with browser cache headers, so subsequent loads
 *   are nearly free.
 * - The map is rendered in a separate document, so we can't reach into it
 *   from React — but that's exactly the property we want.
 */
export function KakaoRoughMap({
  timestamp,
  mapKey,
}: {
  timestamp: string;
  mapKey: string;
}) {
  const srcDoc = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  html, body { margin: 0; padding: 0; overflow: hidden; background: #0f1813; width: 100%; height: 100%; }
  .root_daum_roughmap,
  .root_daum_roughmap .wrap_map,
  .root_daum_roughmap .wrap_map > .map { width: 100% !important; height: 100% !important; }
</style>
</head>
<body>
<div id="daumRoughmapContainer${timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div>
<script charset="UTF-8" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script>
<script charset="UTF-8">
  new daum.roughmap.Lander({
    "timestamp" : "${timestamp}",
    "key" : "${mapKey}",
    "mapWidth" : "100%",
    "mapHeight" : "100%"
  }).render();
</script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={srcDoc}
      title="학원 위치 지도"
      loading="lazy"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        display: "block",
      }}
    />
  );
}
