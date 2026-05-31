"use client";
/* eslint-disable @next/next/no-img-element */

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";

import {
  createTeacherAction,
  presignTeacherPhotoAction,
  updateTeacherAction,
  type FormState,
} from "./actions";
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

const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL ?? "";

function photoUrl(key: string) {
  return key ? `${S3_BASE}/${encodeURI(key)}` : "";
}

function PhotoUploader({ initialKey }: { initialKey: string }) {
  const [key, setKey] = useState(initialKey);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await presignTeacherPhotoAction(file.type, file.size);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const put = await fetch(res.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!put.ok) {
        setError(`업로드 실패 (HTTP ${put.status}). S3 CORS·버킷 정책을 확인해주세요.`);
        return;
      }
      setKey(res.key);
    } catch (err) {
      console.error(err);
      setError("업로드 중 네트워크 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setKey("");
    setError(null);
  };

  const url = photoUrl(key);

  return (
    <div>
      <input type="hidden" name="photoKey" value={key} />
      <div className="flex items-start gap-4">
        <div className="w-24 h-28 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 grid place-items-center">
          {url ? (
            <img src={url} alt="강사 사진" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">사진 없음</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : key ? "사진 변경" : "사진 업로드"}
            </Button>
            {key && (
              <button
                type="button"
                onClick={remove}
                disabled={uploading}
                className="h-9 px-3 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition disabled:opacity-50"
              >
                제거
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">JPG / PNG / WebP / GIF · 5MB 이하 · 권장 비율 3:4 (세로)</p>
          {key && <p className="text-xs text-slate-400 font-mono break-all">{key}</p>}
          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

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
        <Field label="프로필 사진">
          <PhotoUploader initialKey={defaults.photoKey} />
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
