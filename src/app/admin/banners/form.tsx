"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createBannerAction, updateBannerAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton } from "../_components/ui";

type Defaults = {
  title: string;
  subtitle: string;
  imageKey: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  active: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function BannerForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id
    ? updateBannerAction.bind(null, id)
    : createBannerAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <Field label="제목">
          <Input name="title" defaultValue={defaults.title} required />
        </Field>
        <Field label="서브 타이틀">
          <Input name="subtitle" defaultValue={defaults.subtitle} />
        </Field>
        <Field label="배경 이미지 S3 Key" hint="ex) banners/hero-01.jpg — 업로드는 추후 구현 예정">
          <Input name="imageKey" defaultValue={defaults.imageKey} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="CTA 라벨">
            <Input name="ctaLabel" defaultValue={defaults.ctaLabel} placeholder="무료 체험레슨 신청" />
          </Field>
          <Field label="CTA 링크">
            <Input name="ctaHref" defaultValue={defaults.ctaHref} placeholder="#contact" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="정렬 순서" hint="작은 숫자가 먼저">
            <Input name="order" type="number" defaultValue={defaults.order} />
          </Field>
          <label className="flex items-center gap-2 pt-7">
            <input
              type="checkbox"
              name="active"
              defaultChecked={defaults.active}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
            />
            <span className="text-sm text-slate-700">사이트에 노출</span>
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton label={id ? "저장" : "등록"} />
        <LinkButton href="/admin/banners" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
