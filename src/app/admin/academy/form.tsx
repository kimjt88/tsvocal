"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveAcademyAction, type FormState } from "./actions";
import { Button, Card, Field, Input } from "../_components/ui";

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

      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.ok && <span className="text-sm text-emerald-600">저장되었습니다.</span>}
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
