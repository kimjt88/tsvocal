"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateEnrollmentAction, type FormState } from "./actions";
import { Button, Card, Field, LinkButton, Select, Textarea } from "../_components/ui";
import type { EnrollmentStatus } from "@/lib/repositories/enrollments";

const STATUS_OPTIONS: { value: EnrollmentStatus; label: string }[] = [
  { value: "new", label: "신규" },
  { value: "contacted", label: "연락 완료" },
  { value: "booked", label: "예약 완료" },
  { value: "done", label: "수강 시작" },
  { value: "cancelled", label: "취소" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : "저장"}
    </Button>
  );
}

export function EnrollmentForm({
  id,
  defaults,
}: {
  id: string;
  defaults: { status: EnrollmentStatus; note: string };
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateEnrollmentAction.bind(null, id),
    {},
  );
  return (
    <form action={action} className="space-y-6">
      <Card className="p-6 space-y-4">
        <Field label="상태">
          <Select name="status" defaultValue={defaults.status}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="내부 메모" hint="관리자만 봄. 신청자에게는 노출되지 않습니다.">
          <Textarea name="note" defaultValue={defaults.note} />
        </Field>
      </Card>
      <div className="flex items-center gap-3">
        <SubmitButton />
        <LinkButton href="/admin/enrollments" variant="secondary">
          목록
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
