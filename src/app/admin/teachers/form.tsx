"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createTeacherAction, updateTeacherAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../_components/ui";

type Defaults = {
  name: string;
  englishName: string;
  role: string;
  bio: string;
  photoKey: string;
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

export function TeacherForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateTeacherAction.bind(null, id) : createTeacherAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="이름 (한글)">
            <Input name="name" defaultValue={defaults.name} required />
          </Field>
          <Field label="이름 (영문)">
            <Input name="englishName" defaultValue={defaults.englishName} />
          </Field>
        </div>
        <Field label="분야" hint="ex) Vocal / Educator">
          <Input name="role" defaultValue={defaults.role} required />
        </Field>
        <Field label="소개">
          <Textarea name="bio" defaultValue={defaults.bio} />
        </Field>
        <Field label="프로필 사진 S3 Key" hint="ex) teachers/master-j.jpg">
          <Input name="photoKey" defaultValue={defaults.photoKey} />
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
        <LinkButton href="/admin/teachers" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
