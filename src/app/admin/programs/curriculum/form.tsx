"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createCurriculumStepAction, updateCurriculumStepAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../../_components/ui";

type Defaults = {
  number: string;
  title: string;
  description: string;
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

export function CurriculumStepForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateCurriculumStepAction.bind(null, id) : createCurriculumStepAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="단계 번호" hint="예: 01">
            <Input name="number" defaultValue={defaults.number} placeholder="01" />
          </Field>
          <Field label="정렬 순서">
            <Input name="order" type="number" defaultValue={defaults.order} />
          </Field>
        </div>
        <Field label="단계 제목" hint="예: 음성 진단 / 발성 교정">
          <Input name="title" defaultValue={defaults.title} required />
        </Field>
        <Field label="설명">
          <Textarea name="description" defaultValue={defaults.description} required />
        </Field>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaults.active}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
          />
          <span className="text-sm text-slate-700">사이트에 노출</span>
        </label>
      </Card>
      <div className="flex items-center gap-3">
        <SubmitButton label={id ? "저장" : "등록"} />
        <LinkButton href="/admin/programs/curriculum" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
