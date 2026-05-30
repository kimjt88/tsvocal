"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

const TOTAL = 3;
const AUTO_MS = 6000;

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
      timer = setInterval(() => setActive((i) => (i + 1) % TOTAL), AUTO_MS);
    };
    play();

    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", play);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % TOTAL);
        play();
      } else if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + TOTAL) % TOTAL);
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
        setActive((i) => (i + (dx < 0 ? 1 : -1) + TOTAL) % TOTAL);
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
  }, []);

  const go = (n: number) => setActive(((n % TOTAL) + TOTAL) % TOTAL);
  const cls = (i: number) => `hb-slide${active === i ? " is-active" : ""}`;

  return (
    <section className="hero-banner" id="hero" aria-label="메인 배너" ref={sectionRef}>
      <div className="hb-track" style={{ transform: `translateX(${-active * 100}%)` }}>
        <div className={cls(0)}>
          <img
            className="hb-bg"
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80&auto=format&fit=crop"
            alt=""
            loading="eager"
          />
          <div className="hb-content">
            <div className="hb-kicker">
              <span className="rule" />
              Time Save Vocal
            </div>
            <h1 className="hb-title">
              소리의 <em>품격</em>을<br />
              가장 빠르게
            </h1>
            <p className="hb-sub">
              TS는 Time Save. 불필요한 시간 낭비 없이, 검증된 1:1 맞춤 커리큘럼으로 가장 짧은 길을 안내합니다.
            </p>
            <div className="hb-actions">
              <a className="btn btn-primary" href="#contact">
                무료 체험레슨 신청
              </a>
              <a className="btn btn-ghost" href="#program">
                프로그램 보기
              </a>
            </div>
          </div>
        </div>

        <div className={cls(1)}>
          <img
            className="hb-bg"
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
          />
          <div className="hb-content">
            <div className="hb-kicker">
              <span className="rule" />
              발성 · 믹스보이스
            </div>
            <h1 className="hb-title">
              발성 교정부터<br />
              <em>믹스보이스</em>까지
            </h1>
            <p className="hb-sub">
              목에 무리 없는 발성, 편안한 고음. 음역대 진단으로 시작해 나에게 꼭 맞는 트레이닝을 설계합니다.
            </p>
            <div className="hb-actions">
              <a className="btn btn-primary" href="#contact">
                무료 체험레슨 신청
              </a>
              <a className="btn btn-ghost" href="#program">
                보컬 과정 보기
              </a>
            </div>
          </div>
        </div>

        <div className={cls(2)}>
          <img
            className="hb-bg"
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
          />
          <div className="hb-content">
            <div className="hb-kicker">
              <span className="rule" />
              취미 · 입시 · 프로
            </div>
            <h1 className="hb-title">
              취미부터 입시·프로까지<br />
              <em>한 곳</em>에서
            </h1>
            <p className="hb-sub">
              담임 강사 책임 관리와 연습실 무료 대여까지. 목표가 무엇이든 끝까지 함께 성장합니다.
            </p>
            <div className="hb-actions">
              <a className="btn btn-primary" href="#contact">
                무료 체험레슨 신청
              </a>
              <a className="btn btn-ghost" href="#why">
                학원 강점 보기
              </a>
            </div>
          </div>
        </div>
      </div>

      <button className="hb-arrow prev" aria-label="이전 배너" onClick={() => go(active - 1)}>
        ‹
      </button>
      <button className="hb-arrow next" aria-label="다음 배너" onClick={() => go(active + 1)}>
        ›
      </button>
      <div className="hb-dots" role="tablist">
        <button className={active === 0 ? "on" : ""} aria-label="배너 1" onClick={() => go(0)} />
        <button className={active === 1 ? "on" : ""} aria-label="배너 2" onClick={() => go(1)} />
        <button className={active === 2 ? "on" : ""} aria-label="배너 3" onClick={() => go(2)} />
      </div>
    </section>
  );
}
