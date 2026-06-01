"use client";
/* eslint-disable @next/next/no-img-element */

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";

import {
  createBannerAction,
  presignBannerImageAction,
  updateBannerAction,
  type FormState,
} from "./actions";
import { Button, Card, Field, Input, LinkButton, Textarea } from "../_components/ui";

type Defaults = {
  title: string;
  subtitle: string;
  kicker: string;
  imageKey: string;
  bgUrl: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  active: boolean;
};

const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL ?? "";

function s3Url(key: string) {
  return key ? `${S3_BASE}/${encodeURI(key)}` : "";
}

function BannerImageUploader({
  initialKey,
  initialBgUrl,
}: {
  initialKey: string;
  initialBgUrl: string;
}) {
  const [key, setKey] = useState(initialKey);
  const [bgUrl, setBgUrl] = useState(initialBgUrl);
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
      const res = await presignBannerImageAction(file.type, file.size);
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
        setError(`업로드 실패 (HTTP ${put.status}). S3 CORS·버킷 정책 확인 필요.`);
        return;
      }
      setKey(res.key);
      // Uploaded image takes precedence; clear direct URL field
      setBgUrl("");
    } catch (err) {
      console.error(err);
      setError("업로드 중 네트워크 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setKey("");
    setError(null);
  };

  // Preview: bgUrl wins if set, otherwise compute from S3 key
  const previewUrl = bgUrl.trim() || s3Url(key);

  return (
    <div className="space-y-4">
      <input type="hidden" name="imageKey" value={key} />
      <div className="flex items-start gap-5">
        <div className="w-56 h-32 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 grid place-items-center">
          {previewUrl ? (
            <img src={previewUrl} alt="배너 미리보기" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">이미지 없음</span>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : key ? "이미지 변경" : "이미지 업로드"}
            </Button>
            {key && (
              <button
                type="button"
                onClick={removeImage}
                disabled={uploading}
                className="h-9 px-3 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition disabled:opacity-50"
              >
                제거
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            JPG / PNG / WebP / GIF · 8MB 이하 · 권장 비율 16:9 가로 (가로 1600px 이상)
          </p>
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
      <Field
        label="또는 외부 이미지 URL"
        hint="업로드 대신 직접 URL을 사용하려면 입력. 입력 시 업로드된 이미지보다 우선합니다."
      >
        <Input
          name="bgUrl"
          value={bgUrl}
          onChange={(e) => setBgUrl(e.target.value)}
          placeholder="https://..."
        />
      </Field>
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

export function BannerForm({ id, defaults }: { id?: string; defaults: Defaults }) {
  const action = id
    ? updateBannerAction.bind(null, id)
    : createBannerAction;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Card className="p-6 space-y-4">
        <Field label="상단 라벨 (kicker)" hint="제목 위 작은 영문 라벨 — ex) Time Save Vocal">
          <Input name="kicker" defaultValue={defaults.kicker} placeholder="Time Save Vocal" />
        </Field>
        <Field
          label="제목"
          hint="*표로 둘러싼 부분은 강조색(골드)으로 표시됩니다 — ex) 소리의 *품격*을 가장 빠르게"
        >
          <Textarea name="title" defaultValue={defaults.title} rows={2} required />
        </Field>
        <Field label="서브 타이틀">
          <Textarea name="subtitle" defaultValue={defaults.subtitle} rows={2} />
        </Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-sm font-medium text-slate-900">배경 이미지</div>
        <BannerImageUploader initialKey={defaults.imageKey} initialBgUrl={defaults.bgUrl} />
      </Card>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="CTA 라벨">
            <Input name="ctaLabel" defaultValue={defaults.ctaLabel} placeholder="무료 체험레슨 신청" />
          </Field>
          <Field label="CTA 링크">
            <Input name="ctaHref" defaultValue={defaults.ctaHref} placeholder="/apply" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="정렬 순서" hint="작은 숫자가 먼저">
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
        <LinkButton href="/admin/banners" variant="secondary">
          취소
        </LinkButton>
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
