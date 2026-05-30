"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { setupAction, type FormState } from "../actions";
import { Button, Field, Input } from "../_components/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "생성 중..." : "관리자 계정 생성"}
    </Button>
  );
}

export function SetupForm() {
  const [state, action] = useActionState<FormState, FormData>(setupAction, {});

  return (
    <form
      action={action}
      className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4"
    >
      <Field label="아이디" hint="3자 이상">
        <Input name="username" autoComplete="username" required autoFocus />
      </Field>
      <Field label="비밀번호" hint="8자 이상">
        <Input name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="비밀번호 확인" error={state.error}>
        <Input name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <SubmitButton />
    </form>
  );
}
