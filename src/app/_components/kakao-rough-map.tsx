"use client";

import { useEffect } from "react";

const LOADER_SRC = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

type LanderOpts = { timestamp: string; key: string; mapWidth: string; mapHeight: string };
type Lander = { render: () => void };

declare global {
  interface Window {
    daum?: {
      roughmap?: {
        Lander: new (opts: LanderOpts) => Lander;
        cdn?: string;
      };
    };
  }
}

let loaderInitiated = false;

// The Kakao loader script uses document.write() to inject the actual Lander script.
// document.write is a no-op after the initial HTML parse, so when we attach the loader
// dynamically (in useEffect), the inner Lander script never loads. Workaround: patch
// document.write to convert any written <script src="..."> into a real appendChild,
// then restore the original after the loader's onload fires.
function loadLoaderOnce() {
  if (typeof document === "undefined") return;
  if (window.daum?.roughmap?.Lander) return;
  if (loaderInitiated) return;
  loaderInitiated = true;

  const originalWrite = document.write;
  document.write = function patchedWrite(html: string) {
    const m = /<script[^>]*\ssrc=["']([^"']+)["']/i.exec(html);
    if (m) {
      const s = document.createElement("script");
      s.src = m[1];
      s.charset = "UTF-8";
      document.head.appendChild(s);
      return;
    }
    return originalWrite.call(document, html);
  } as typeof document.write;

  const loader = document.createElement("script");
  loader.src = LOADER_SRC;
  loader.charset = "UTF-8";
  loader.className = "daum_roughmap_loader_script";
  const restore = () => {
    document.write = originalWrite;
  };
  loader.onload = restore;
  loader.onerror = () => {
    restore();
    loaderInitiated = false; // allow retry on next mount
  };
  document.head.appendChild(loader);
}

function waitForLander(timeoutMs = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.daum?.roughmap?.Lander) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error("Kakao roughmap loader timeout"));
      setTimeout(tick, 50);
    };
    tick();
  });
}

export function KakaoRoughMap({
  timestamp,
  mapKey,
}: {
  timestamp: string;
  mapKey: string;
}) {
  useEffect(() => {
    let cancelled = false;
    loadLoaderOnce();
    waitForLander()
      .then(() => {
        if (cancelled) return;
        const container = document.getElementById(`daumRoughmapContainer${timestamp}`);
        if (!container) return;
        container.innerHTML = "";
        try {
          new window.daum!.roughmap!.Lander({
            timestamp,
            key: mapKey,
            mapWidth: "100%",
            mapHeight: "100%",
          }).render();
        } catch (e) {
          console.error("Kakao roughmap render failed", e);
        }
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
  }, [timestamp, mapKey]);

  return (
    <div
      id={`daumRoughmapContainer${timestamp}`}
      className="root_daum_roughmap root_daum_roughmap_landing"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
