"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createClassOfferingAction, updateClassOfferingAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../../_components/ui";

type Defaults = {
  badge: string;
  name: string;
  forWhom: string;
  features: string[];
  frequency: string;
  sessionLength: string;
  featured: boolean;
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

export function ClassOfferingForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateClassOfferingAction.bind(null, id) : createClassOfferingAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="배지" hint="예: Hobby, Pro · 추천, Admission">
            <Input name="badge" defaultValue={defaults.badge} />
          </Field>
          <Field label="반 이름">
            <Input name="name" defaultValue={defaults.name} required placeholder="취미반" />
          </Field>
        </div>
        <Field label="대상" hint="예: 노래가 좋아서 시작하는 분">
          <Input name="forWhom" defaultValue={defaults.forWhom} />
        </Field>
        <Field label="특징 (한 줄에 하나씩)" hint="• 표시는 자동으로 들어갑니다">
          <Textarea
            name="features"
            defaultValue={defaults.features.join("\n")}
            rows={5}
            placeholder={"스트레스 없이 즐기는 1:1 레슨\n좋아하는 곡 중심 진행\n발성 기초 + 음정·박자 교정"}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="횟수" hint="예: 주 1회, 주 1~2회">
            <Input name="frequency" defaultValue={defaults.frequency} />
          </Field>
          <Field label="세션 길이" hint="예: 회당 50분">
            <Input name="sessionLength" defaultValue={defaults.sessionLength} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="정렬 순서">
            <Input name="order" type="number" defaultValue={defaults.order} />
          </Field>
          <div className="flex flex-col gap-2 pt-7">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={defaults.featured}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="text-sm text-slate-700">추천 (골드 강조)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                defaultChecked={defaults.active}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="text-sm text-slate-700">사이트에 노출</span>
            </label>
          </div>
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <SubmitButton label={id ? "저장" : "등록"} />
        <LinkButton href="/admin/programs/classes" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
