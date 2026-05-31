import type { Metadata } from "next";
import Link from "next/link";

import { ApplyForm } from "./form";

export const metadata: Metadata = {
  title: "체험레슨 신청 — TS보컬학원",
  description: "TS보컬학원 1:1 무료 체험레슨 신청 페이지입니다. 진단·상담은 무료입니다.",
};

export default function ApplyPage() {
  return (
    <section className="block" style={{ paddingTop: 64 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Free Trial</span>
          <h2>1:1 무료 체험레슨 신청</h2>
          <p>입력하신 정보로 영업일 기준 1–2일 내에 상담 연락 드립니다. 진단·상담은 무료입니다.</p>
        </div>
        <ApplyForm />
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/" className="apply-back-link">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
