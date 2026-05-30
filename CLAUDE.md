@AGENTS.md

# ts vocal academy site
## ts보컬 학원 소개 사이트 입니다.

학원 소개·강사·커리큘럼·공지 등을 노출하는 공개 사이트와, 운영자가 콘텐츠를 직접 관리하는 어드민으로 구성됩니다. 백엔드는 AWS (DynamoDB / S3 / Amplify Hosting) 를 사용합니다.

## 기술 스택

### 현재 적용됨
- **Next.js 16** (App Router, Turbopack 기본 활성화)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **ESLint 9** (flat config: `eslint.config.mjs`)

### 적용 예정 (AWS)
- **DynamoDB** — 학원/강사/공지/문의 등 콘텐츠 저장
- **S3** — 이미지/영상 등 미디어 에셋 저장
- **AWS Amplify Hosting** — Next.js 앱 배포 (CI/CD 포함)
- **인증** — 어드민 로그인용. TODO: Cognito / NextAuth / 단순 패스워드 중 결정 필요

## 사이트 구성

### 공개 사이트 (`/`)
- 홈 / 학원 소개 / 강사 소개 / 커리큘럼 / 공지·블로그 / 문의
- 대부분 정적 또는 ISR 로 노출 (DynamoDB → 빌드/리밸리데이트 시 fetch)
- 미디어는 S3 → CloudFront 또는 Next.js `<Image>` remote pattern

### 어드민 (`/admin`)
- 운영자가 위 콘텐츠를 CRUD
- 사용자 페이지와 레이아웃·내비게이션 완전 분리
- 접근 제어: `middleware.ts` 에서 세션/롤 검사, 비인가 시 로그인 페이지로 리다이렉트
- 이미지 업로드는 **S3 presigned URL** 방식 (서버에서 URL 발급, 브라우저가 직접 PUT)
- mutation 은 Server Action 또는 `/api/admin/*` Route Handler 로 통일

## 디렉토리 구조 (목표)

```
src/
  app/
    (site)/              공개 사이트 (Route Group)
      page.tsx
      about/
      teachers/
      curriculum/
      notice/
      contact/
    admin/               어드민
      layout.tsx
      login/
      teachers/
      notice/
      _components/       어드민 전용 컴포넌트 (라우팅 제외)
    api/                 Route Handler
    layout.tsx           루트 레이아웃
    globals.css
  lib/                   서버 전용 유틸
    dynamodb.ts
    s3.ts
    auth.ts
  components/            공용 UI
middleware.ts            /admin 권한 체크
public/                  정적 파일
```

- 서버 전용 모듈 상단에 `import "server-only"` 권장 (클라이언트 번들 유출 방지)
- `_components` 처럼 `_` prefix 폴더는 Next.js 가 라우팅에서 제외

## AWS 연동 가이드

### DynamoDB
- 패키지: `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb` (DocumentClient)
- 클라이언트 단일화 위치: `src/lib/dynamodb.ts`
- 키 설계: **TODO** — 학원 사이트는 엔티티 수가 적으므로 단일 테이블 + PK/SK 패턴 고려
- 호출은 서버 컴포넌트 / Route Handler / Server Action 내부에서만

### S3
- 패키지: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- 업로드: 어드민에서 **presigned URL** 발급 → 브라우저가 직접 PUT (시크릿 클라이언트 노출 금지)
- 읽기: 공개 콘텐츠는 버킷 공개 + CloudFront, 비공개는 presigned GET

### Amplify Hosting
- 배포 단위: 본 리포지토리 `main` 브랜치
- 환경변수: Amplify 콘솔에서 설정 (테이블명, 버킷명, 리전, 인증 키 등)
- 빌드 스펙: `amplify.yml` — **TODO** 작성 필요
- Next.js 16 SSR/ISR 지원 범위는 배포 전 Amplify 문서로 점검

## 환경변수

`.env.local` 예시 (값은 커밋 금지):
```
AWS_REGION=ap-northeast-2
DYNAMODB_TABLE_NAME=
S3_BUCKET_NAME=
# 인증 관련 키는 인증 방식 확정 후 추가
```

`.env*` 는 이미 `.gitignore` 처리됨.

## 명령어

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (Turbopack) — http://localhost:3000 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 |
| `npm run lint` | ESLint |

## 작업 시 주의사항

- Next.js 16 은 학습 데이터와 다를 수 있음 → `@AGENTS.md` 와 `node_modules/next/dist/docs/` 우선 확인
- AWS 시크릿·자격증명은 절대 커밋 금지
- AWS SDK 호출은 서버 사이드에서만 (`server-only` 가드 사용)
- 어드민 경로 추가/수정 시 `middleware.ts` matcher 도 함께 갱신
- 운영 콘텐츠 변경 후 ISR 캐시 무효화 (`revalidatePath` / `revalidateTag`) 잊지 말 것

## TODO (초기 세팅 단계)

- [ ] 어드민 인증 방식 결정 (Cognito / NextAuth / 단순 패스워드)
- [ ] DynamoDB 테이블 스키마 설계 (강사, 공지, 문의 등)
- [ ] S3 버킷 정책 / CORS / 라이프사이클 정의
- [ ] Amplify Hosting 연결 및 `amplify.yml` 작성
- [ ] `middleware.ts` 로 `/admin` 보호 구현
- [ ] `src/lib/dynamodb.ts`, `src/lib/s3.ts` 스캐폴딩
- [ ] `(site)` / `admin` Route Group 분리 및 각 레이아웃 작성


## AWS 자격증명

- **절대 이 파일에 키를 적지 말 것.** 키는 `.env.local`(gitignored)에 보관.
- 환경변수: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- 테이블/버킷: `DYNAMODB_ADMINS_TABLE=Admins`, `DYNAMODB_ACADEMY_TABLE=AcademyData`, `S3_BUCKET_NAME=tsvocal`
- Amplify 배포에서는 콘솔 환경변수에 동일 키를 설정
- 키 노출 시 즉시 AWS IAM 콘솔에서 Deactivate → 새 키 발급 → `.env.local` 업데이트