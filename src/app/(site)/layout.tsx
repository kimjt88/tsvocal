import Link from "next/link";

import { BrandLogo } from "../_components/brand-logo";
import { ScrollReveal } from "../_components/scroll-reveal";
import { SiteHeader } from "../_components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <a id="top" />
      {children}
      <footer className="site">
        <div className="wrap">
          <div className="foot-top">
            <Link className="logo" href="/#top">
              <BrandLogo />
              <span className="wm">
                <b>TS보컬학원</b>
                <em>Time Save Vocal</em>
              </span>
            </Link>
            <div className="foot-links">
              <a href="https://cafe.naver.com" target="_blank" rel="noopener">
                네이버 카페
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener">
                유튜브
              </a>
              <Link href="/#program">프로그램</Link>
              <Link href="/#why">학원 강점</Link>
              <Link href="/#teachers">강사진</Link>
              <Link href="/#contact">오시는 길</Link>
            </div>
          </div>
          <div>
            © 2026 TS보컬학원 (Time Save Vocal). 학원설립운영등록 제0000호 · 대표 ○○○ · 사업자등록번호 000-00-00000
          </div>
        </div>
      </footer>
      <ScrollReveal />
    </div>
  );
}
