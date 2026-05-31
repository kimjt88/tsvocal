import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "신청 완료 — TS보컬학원",
};

export default function ApplySuccessPage() {
  return (
    <section className="block" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="wrap">
        <div className="cta-band" style={{ maxWidth: 640, margin: "0 auto" }}>
          <span className="eyebrow">Submitted</span>
          <h2>
            신청해주셔서<br />감사합니다
          </h2>
          <p>
            입력하신 연락처로 영업일 기준 1–2일 내에
            <br />
            담임 강사가 직접 연락드리겠습니다.
          </p>
          <Link href="/" className="btn btn-primary">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
