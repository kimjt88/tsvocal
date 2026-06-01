"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

const AUTO_MS = 6000;

export type HeroSlide = {
  bg: string;
  kicker?: string;
  title: string; // "*text*" portions render in gold
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

// Render title with *gold-emphasis* parts wrapped in <em>
function renderTitle(title: string): React.ReactNode {
  if (!title) return null;
  // Split by line breaks, then by *...*
  const lines = title.split(/\r?\n/);
  return lines.flatMap((line, li) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
    const nodes = parts.map((p, i) => {
      if (p.startsWith("*") && p.endsWith("*") && p.length > 1) {
        return <em key={`${li}-${i}`}>{p.slice(1, -1)}</em>;
      }
      return <span key={`${li}-${i}`}>{p}</span>;
    });
    return li < lines.length - 1 ? [...nodes, <br key={`br-${li}`} />] : nodes;
  });
}

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const total = slides.length;
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (total <= 1) return;
    const section = sectionRef.current;
    if (!section) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const play = () => {
      stop();
      timer = setInterval(() => setActive((i) => (i + 1) % total), AUTO_MS);
    };
    play();

    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", play);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % total);
        play();
      } else if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + total) % total);
        play();
      }
    };
    document.addEventListener("keydown", onKey);

    let sx: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      stop();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 44) {
        setActive((i) => (i + (dx < 0 ? 1 : -1) + total) % total);
      }
      sx = null;
      play();
    };
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      stop();
      section.removeEventListener("mouseenter", stop);
      section.removeEventListener("mouseleave", play);
      document.removeEventListener("keydown", onKey);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
    };
  }, [total]);

  if (total === 0) return null;
  const go = (n: number) => setActive(((n % total) + total) % total);
  const cls = (i: number) => `hb-slide${active === i ? " is-active" : ""}`;

  return (
    <section className="hero-banner" id="hero" aria-label="메인 배너" ref={sectionRef}>
      <div className="hb-track" style={{ transform: `translateX(${-active * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className={cls(i)}>
            <img className="hb-bg" src={s.bg} alt="" loading={i === 0 ? "eager" : "lazy"} />
            <div className="hb-content">
              {s.kicker && (
                <div className="hb-kicker">
                  <span className="rule" />
                  {s.kicker}
                </div>
              )}
              <h1 className="hb-title">{renderTitle(s.title)}</h1>
              {s.subtitle && <p className="hb-sub">{s.subtitle}</p>}
              <div className="hb-actions">
                <a className="btn btn-primary" href={s.ctaHref || "/apply"}>
                  {s.ctaLabel || "무료 체험레슨 신청"}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button className="hb-arrow prev" aria-label="이전 배너" onClick={() => go(active - 1)}>
            ‹
          </button>
          <button className="hb-arrow next" aria-label="다음 배너" onClick={() => go(active + 1)}>
            ›
          </button>
          <div className="hb-dots" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                className={active === i ? "on" : ""}
                aria-label={`배너 ${i + 1}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
