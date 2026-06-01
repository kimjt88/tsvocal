"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createBeforeAfterAction, updateBeforeAfterAction, type FormState } from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../../_components/ui";

type Metric = { label: string; change: string; before: number; after: number };

type Defaults = {
  initial: string;
  studentName: string;
  studentInfo: string;
  metrics: Metric[];
  quote: string;
  order: number;
  active: boolean;
};

const MAX_METRICS = 6;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function BeforeAfterForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id ? updateBeforeAfterAction.bind(null, id) : createBeforeAfterAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  // Provide a stable number of metric slots (filled + empty up to MAX)
  const filled = defaults.metrics ?? [];
  const slots = Array.from({ length: MAX_METRICS }, (_, i) => filled[i] ?? { label: "", change: "", before: 0, after: 0 });

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="이니셜" hint="아바타에 표시 (1–2자)">
            <Input name="initial" defaultValue={defaults.initial} maxLength={2} placeholder="K" />
          </Field>
          <Field label="수강생 이름">
            <Input name="studentName" defaultValue={defaults.studentName} required placeholder="30대 직장인 · 김○○" />
          </Field>
          <Field label="수강 정보">
            <Input name="studentInfo" defaultValue={defaults.studentInfo} placeholder="취미반 · 수강 3개월" />
          </Field>
        </div>
        <Field label="후기 인용 (q)">
          <Textarea name="quote" defaultValue={defaults.quote} rows={2} placeholder="“고음만 가면 갈라졌는데...”" />
        </Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-sm font-medium text-slate-900">측정 메트릭 (최대 {MAX_METRICS}개)</div>
        <p className="text-xs text-slate-500">label과 before/after는 모두 입력해주세요. before/after는 0–100 (%). label 비우면 해당 줄은 저장되지 않습니다.</p>
        {slots.map((m, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-4">
              <label className="block text-xs text-slate-500 mb-1">메트릭 {i + 1} 라벨</label>
              <Input name={`metric_${i}_label`} defaultValue={m.label} placeholder="최고음 음역대" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">변화</label>
              <Input name={`metric_${i}_change`} defaultValue={m.change} placeholder="+5키" />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-slate-500 mb-1">전 (%)</label>
              <Input name={`metric_${i}_before`} type="number" min={0} max={100} defaultValue={m.before} />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-slate-500 mb-1">후 (%)</label>
              <Input name={`metric_${i}_after`} type="number" min={0} max={100} defaultValue={m.after} />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
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
        <LinkButton href="/admin/programs/before-after" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
