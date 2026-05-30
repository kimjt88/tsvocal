"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createReviewAction, updateReviewAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Select, Textarea } from "../_components/ui";

type Defaults = {
  studentName: string;
  studentInfo: string;
  rating: number;
  body: string;
  visible: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function ReviewForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateReviewAction.bind(null, id) : createReviewAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="작성자 이름">
            <Input name="studentName" defaultValue={defaults.studentName} required />
          </Field>
          <Field label="작성자 정보" hint="ex) 취미 보컬 · 5개월차">
            <Input name="studentInfo" defaultValue={defaults.studentInfo} />
          </Field>
        </div>
        <Field label="평점">
          <Select name="rating" defaultValue={defaults.rating}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}점
              </option>
            ))}
          </Select>
        </Field>
        <Field label="리뷰 내용">
          <Textarea name="body" defaultValue={defaults.body} required />
        </Field>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={defaults.visible}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
          />
          <span className="text-sm text-slate-700">사이트에 노출</span>
        </label>
      </Card>
      <div className="flex items-center gap-3">
        <SubmitButton label={id ? "저장" : "등록"} />
        <LinkButton href="/admin/reviews" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
