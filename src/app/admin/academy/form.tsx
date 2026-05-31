"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveAcademyAction, type FormState } from "./actions";
import { Button, Card, Field, Input, Textarea } from "../_components/ui";

type Defaults = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  hours: string;
  email: string;
  naverCafeUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  mapEmbedUrl: string;
  registrationNumber: string;
  representativeName: string;
  businessNumber: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : "저장"}
    </Button>
  );
}

export function AcademyForm({ defaults }: { defaults: Defaults }) {
  const [state, action] = useActionState<FormState, FormData>(saveAcademyAction, {});

  return (
    <form action={action} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="학원명">
            <Input name="name" defaultValue={defaults.name} required />
          </Field>
          <Field label="태그라인" hint="ex) Time Save Vocal">
            <Input name="tagline" defaultValue={defaults.tagline} />
          </Field>
        </div>
        <Field label="주소">
          <Input name="address" defaultValue={defaults.address} required />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="전화번호">
            <Input name="phone" defaultValue={defaults.phone} required />
          </Field>
          <Field label="운영시간">
            <Input name="hours" defaultValue={defaults.hours} placeholder="평일 12:00–22:00 · 주말 11:00–18:00" />
          </Field>
        </div>
        <Field label="이메일">
          <Input name="email" type="email" defaultValue={defaults.email} />
        </Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-sm font-medium text-slate-900">소셜 링크</div>
        <Field label="네이버 카페 URL">
          <Input name="naverCafeUrl" type="url" defaultValue={defaults.naverCafeUrl} placeholder="https://cafe.naver.com/..." />
        </Field>
        <Field label="유튜브 URL">
          <Input name="youtubeUrl" type="url" defaultValue={defaults.youtubeUrl} placeholder="https://youtube.com/..." />
        </Field>
        <Field label="인스타그램 URL">
          <Input name="instagramUrl" type="url" defaultValue={defaults.instagramUrl} placeholder="https://instagram.com/..." />
        </Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-sm font-medium text-slate-900">사업자 정보 (푸터 노출)</div>
        <Field label="학원설립운영등록 번호" hint="예: 제0000호">
          <Input name="registrationNumber" defaultValue={defaults.registrationNumber} placeholder="제0000호" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="대표자명">
            <Input name="representativeName" defaultValue={defaults.representativeName} placeholder="홍길동" />
          </Field>
          <Field label="사업자등록번호" hint="예: 000-00-00000">
            <Input name="businessNumber" defaultValue={defaults.businessNumber} placeholder="000-00-00000" />
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-sm font-medium text-slate-900">오시는 길 지도</div>
        <Field
          label="지도 임베드 (카카오 ‘지도 퍼가기’ 권장)"
          hint="카카오맵 → 우측 상단 ‘지도 퍼가기’ → 위치 설정 → ‘HTML 코드 가져오기’의 코드 전체를 복사해 붙여넣으면 됩니다. 구글 지도 iframe 코드/URL도 동일 칸에 붙여 넣을 수 있습니다. 비우면 지도는 표시되지 않습니다."
        >
          <Textarea
            name="mapEmbedUrl"
            defaultValue={defaults.mapEmbedUrl}
            rows={8}
            className="font-mono text-xs"
            placeholder={'<div id="daumRoughmapContainer..."></div>\n<script ...></script>\n<script>new daum.roughmap.Lander({...}).render();</script>'}
          />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.ok && <span className="text-sm text-emerald-600">저장되었습니다.</span>}
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
