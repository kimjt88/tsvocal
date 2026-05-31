"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitApplyAction, type ApplyFormState } from "./actions";

const AGE_OPTIONS = ["10대 미만", "10대", "20대", "30대", "40대", "50대", "60대 이상"];
const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "응답 안 함" },
];
const PURPOSE_OPTIONS = [
  { value: "hobby", label: "취미" },
  { value: "skill", label: "실력 향상" },
  { value: "admission", label: "입시 준비" },
  { value: "pro", label: "프로 활동" },
  { value: "other", label: "기타" },
];
const TIME_OPTIONS = [
  "평일 오전",
  "평일 오후",
  "평일 저녁",
  "주말 오전",
  "주말 오후",
  "협의",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary"
      disabled={pending}
      style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
    >
      {pending ? "신청 중..." : "체험레슨 신청하기"}
    </button>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div className="apply-error">{msg}</div>;
}

export function ApplyForm() {
  const [state, action] = useActionState<ApplyFormState, FormData>(submitApplyAction, {});

  return (
    <form action={action} className="apply-form">
      <div className="apply-field">
        <label className="label" htmlFor="apply-name">
          이름 <span className="req">*</span>
        </label>
        <input
          id="apply-name"
          name="name"
          type="text"
          required
          maxLength={50}
          className="apply-input"
          placeholder="홍길동"
          autoComplete="name"
        />
        <ErrorMsg msg={state.fieldErrors?.name} />
      </div>

      <div className="apply-field">
        <label className="label" htmlFor="apply-phone">
          연락처 <span className="req">*</span>
        </label>
        <input
          id="apply-phone"
          name="phone"
          type="tel"
          required
          maxLength={30}
          className="apply-input"
          placeholder="010-1234-5678"
          autoComplete="tel"
        />
        <ErrorMsg msg={state.fieldErrors?.phone} />
      </div>

      <div className="apply-field">
        <span className="label">
          연령 <span className="req">*</span>
        </span>
        <div className="apply-radio-group">
          {AGE_OPTIONS.map((a) => (
            <label key={a}>
              <input type="radio" name="age" value={a} required />
              <span>{a}</span>
            </label>
          ))}
        </div>
        <ErrorMsg msg={state.fieldErrors?.age} />
      </div>

      <div className="apply-field">
        <span className="label">
          성별 <span className="req">*</span>
        </span>
        <div className="apply-radio-group">
          {GENDER_OPTIONS.map((g) => (
            <label key={g.value}>
              <input type="radio" name="gender" value={g.value} required />
              <span>{g.label}</span>
            </label>
          ))}
        </div>
        <ErrorMsg msg={state.fieldErrors?.gender} />
      </div>

      <div className="apply-field">
        <span className="label">
          레슨 목적 <span className="req">*</span>
        </span>
        <div className="apply-radio-group">
          {PURPOSE_OPTIONS.map((p) => (
            <label key={p.value}>
              <input type="radio" name="lessonPurpose" value={p.value} required />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
        <ErrorMsg msg={state.fieldErrors?.lessonPurpose} />
      </div>

      <div className="apply-field">
        <span className="label">희망 레슨 시간</span>
        <div className="apply-radio-group">
          {TIME_OPTIONS.map((t) => (
            <label key={t}>
              <input type="radio" name="preferredLessonTime" value={t} />
              <span>{t}</span>
            </label>
          ))}
        </div>
        <div className="hint">상담 시 자세히 협의 가능합니다.</div>
      </div>

      <div className="apply-field">
        <label className="label" htmlFor="apply-genre">
          선호하는 음악 장르
        </label>
        <input
          id="apply-genre"
          name="musicGenre"
          type="text"
          maxLength={200}
          className="apply-input"
          placeholder="예: 발라드, 팝, R&B, 뮤지컬 등"
        />
        <div className="hint">자유롭게 적어주세요.</div>
      </div>

      <div className="apply-field">
        <label className="apply-consent">
          <input type="checkbox" name="consent" required />
          <span>
            <strong>개인정보 수집·이용에 동의합니다. *</strong>
            <span className="apply-consent-detail">
              수집 항목: 이름, 연락처, 연령, 성별, 레슨 목적, 희망 시간, 선호 장르 / 이용 목적: 체험레슨 상담 / 보관 기간: 상담 종료 후 1년
            </span>
          </span>
        </label>
        <ErrorMsg msg={state.fieldErrors?.consent} />
      </div>

      {state.error && <div className="apply-error" style={{ marginBottom: 12 }}>{state.error}</div>}

      <SubmitButton />
    </form>
  );
}
