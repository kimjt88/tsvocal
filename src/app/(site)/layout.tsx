import Link from "next/link";

import { BrandLogo } from "../_components/brand-logo";
import { ScrollReveal } from "../_components/scroll-reveal";
import { SiteHeader } from "../_components/site-header";
import { getAcademy } from "@/lib/repositories/academy";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const academy = await getAcademy().catch(() => null);
  const naverCafeUrl = academy?.naverCafeUrl?.trim() || "https://cafe.naver.com";
  const youtubeUrl = academy?.youtubeUrl?.trim() || "https://youtube.com";
  const instagramUrl = academy?.instagramUrl?.trim();
  const academyName = academy?.name?.trim() || "TS보컬학원";
  const academyTagline = academy?.tagline?.trim() || "Time Save Vocal";
  const registrationNumber = academy?.registrationNumber?.trim() || "제0000호";
  const representativeName = academy?.representativeName?.trim() || "○○○";
  const businessNumber = academy?.businessNumber?.trim() || "000-00-00000";

  // LocalBusiness / EducationalOrganization JSON-LD for Google/Naver rich results.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sameAs = [
    academy?.naverCafeUrl?.trim(),
    academy?.youtubeUrl?.trim(),
    academy?.instagramUrl?.trim(),
  ].filter((u): u is string => Boolean(u));
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: academyName,
    alternateName: academyTagline,
    url: siteUrl,
    inLanguage: "ko",
    areaServed: "KR",
  };
  if (academy?.phone) jsonLd.telephone = academy.phone;
  if (academy?.email) jsonLd.email = academy.email;
  if (academy?.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: academy.address,
      addressCountry: "KR",
    };
  }
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;
  // Silence unused — keeps relative URL ready for any further enrichment
  void instagramUrl;

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader naverCafeUrl={naverCafeUrl} youtubeUrl={youtubeUrl} />
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
              <a href={naverCafeUrl} target="_blank" rel="noopener">
                네이버 카페
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener">
                유튜브
              </a>
              <Link href="/#program">프로그램</Link>
              <Link href="/#why">학원 강점</Link>
              <Link href="/#teachers">강사진</Link>
              <Link href="/#contact">오시는 길</Link>
            </div>
          </div>
          <div>
            © 2026 {academyName} ({academyTagline}). 학원설립운영등록 {registrationNumber} · 대표 {representativeName} · 사업자등록번호 {businessNumber}
          </div>
        </div>
      </footer>
      <ScrollReveal />
    </div>
  );
}
