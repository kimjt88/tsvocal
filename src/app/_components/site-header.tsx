"use client";

import { useEffect, useRef } from "react";
import { BrandLogo } from "./brand-logo";

export function SiteHeader({
  naverCafeUrl = "https://cafe.naver.com",
  youtubeUrl = "https://youtube.com",
}: {
  naverCafeUrl?: string;
  youtubeUrl?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hdr = ref.current;
    if (!hdr) return;
    const onScroll = () => {
      hdr.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={ref}>
      <div className="wrap nav">
        <a className="logo" href="#top">
          <BrandLogo />
          <span className="wm">
            <b>TS보컬학원</b>
            <em>Time Save Vocal</em>
          </span>
        </a>
        <nav className="menu">
          <a href="#program">프로그램</a>
          <a href="#why">학원 강점</a>
          <a href="#teachers">강사진</a>
          <a href="#review">후기</a>
          <a href="#contact">오시는 길</a>
        </nav>
        <div className="nav-right">
          <a
            className="soc naver"
            href={naverCafeUrl}
            target="_blank"
            rel="noopener"
            aria-label="네이버 카페"
            title="네이버 카페"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h6.4l4.2 6.1V3H21v18h-6.4l-4.2-6.1V21H3V3z" />
            </svg>
            <span className="soc-label">네이버 카페</span>
          </a>
          <a
            className="soc youtube"
            href={youtubeUrl}
            target="_blank"
            rel="noopener"
            aria-label="유튜브 채널"
            title="유튜브 채널"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
            </svg>
            <span className="soc-label">유튜브</span>
          </a>
          <a className="nav-cta" href="/apply">
            체험레슨 신청
          </a>
        </div>
      </div>
    </header>
  );
}
