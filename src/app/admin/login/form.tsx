"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type FormState } from "../actions";
import { Button, Field, Input } from "../_components/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "로그인 중..." : "로그인"}
    </Button>
  );
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form
      action={action}
      className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4"
    >
      <input type="hidden" name="next" value={nextPath} />
      <Field label="아이디">
        <Input name="username" autoComplete="username" required autoFocus />
      </Field>
      <Field label="비밀번호" error={state.error}>
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton />
    </form>
  );
}
