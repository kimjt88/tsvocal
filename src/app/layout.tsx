import type { Metadata } from "next";
import { Cormorant_Garamond, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TS보컬학원 — Time Save Vocal | 1:1 맞춤 보컬레슨",
    template: "%s | TS보컬학원",
  },
  description:
    "TS보컬학원은 발성 교정·믹스보이스·실용음악 입시까지 1:1 맞춤 커리큘럼으로 가르치는 보컬 전문 학원입니다. 무료 체험레슨 신청 가능.",
  keywords: [
    "TS보컬학원",
    "보컬학원",
    "보컬레슨",
    "발성 교정",
    "믹스보이스",
    "실용음악 입시",
    "1:1 보컬레슨",
    "노래 학원",
    "성인 보컬",
    "Time Save Vocal",
  ],
  authors: [{ name: "TS보컬학원" }],
  creator: "TS보컬학원",
  publisher: "TS보컬학원",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "TS보컬학원 — Time Save Vocal",
    title: "TS보컬학원 — Time Save Vocal | 1:1 맞춤 보컬레슨",
    description:
      "발성 교정·믹스보이스·실용음악 입시까지 1:1 맞춤 커리큘럼. 무료 체험레슨 신청 가능.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TS보컬학원 — Time Save Vocal",
    description:
      "발성 교정·믹스보이스·실용음악 입시까지 1:1 맞춤 커리큘럼. 무료 체험레슨 신청 가능.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NAVER_SITE_VERIFICATION
        ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
        : {}),
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${nanumMyeongjo.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
