"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createProgramAction, updateProgramAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../_components/ui";

type Defaults = {
  name: string;
  subtitle: string;
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

export function ProgramForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateProgramAction.bind(null, id) : createProgramAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="프로그램명">
            <Input name="name" defaultValue={defaults.name} required />
          </Field>
          <Field label="서브타이틀" hint="영문 부제 등">
            <Input name="subtitle" defaultValue={defaults.subtitle} />
          </Field>
        </div>
        <Field label="설명">
          <Textarea name="description" defaultValue={defaults.description} required />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="정렬 순서">
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
        <LinkButton href="/admin/programs" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
