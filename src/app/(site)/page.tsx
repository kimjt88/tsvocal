/* eslint-disable @next/next/no-img-element */
import { HeroBanner } from "../_components/hero-banner";
import { KakaoRoughMap } from "../_components/kakao-rough-map";
import { getAcademy } from "@/lib/repositories/academy";
import { listBanners } from "@/lib/repositories/banners";
import { listBeforeAfters } from "@/lib/repositories/before-afters";
import { listClassOfferings } from "@/lib/repositories/class-offerings";
import { listCurriculumSteps } from "@/lib/repositories/curriculum-steps";
import { listReviews } from "@/lib/repositories/reviews";
import { listTeachers } from "@/lib/repositories/teachers";
import { listTeachingMethods } from "@/lib/repositories/teaching-methods";
import { listWhyFeatures } from "@/lib/repositories/why-features";
import type { HeroSlide } from "../_components/hero-banner";

const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL ?? "";

// Mask all characters except the first with "○" — preserves the surname,
// hides identifiable given name. e.g., "김민수" → "김○○". Pre-masked names
// (containing "○" already) are returned unchanged so legacy/admin-entered
// values like "박○○" stay intact.
function maskStudentName(name: string): string {
  if (!name) return "";
  if (name.includes("○")) return name;
  if (name.length <= 1) return name;
  return name.charAt(0) + "○".repeat(name.length - 1);
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    bg: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80&auto=format&fit=crop",
    kicker: "Time Save Vocal",
    title: "소리의 *품격*을\n가장 빠르게",
    subtitle:
      "TS는 Time Save. 불필요한 시간 낭비 없이, 검증된 1:1 맞춤 커리큘럼으로 가장 짧은 길을 안내합니다.",
    ctaLabel: "무료 체험레슨 신청",
    ctaHref: "/apply",
  },
  {
    bg: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80&auto=format&fit=crop",
    kicker: "발성 · 믹스보이스",
    title: "발성 교정부터\n*믹스보이스*까지",
    subtitle: "목에 무리 없는 발성, 편안한 고음. 음역대 진단으로 시작해 나에게 꼭 맞는 트레이닝을 설계합니다.",
    ctaLabel: "무료 체험레슨 신청",
    ctaHref: "/apply",
  },
  {
    bg: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80&auto=format&fit=crop",
    kicker: "취미 · 입시 · 프로",
    title: "취미부터 입시·프로까지\n*한 곳*에서",
    subtitle: "담임 강사 책임 관리와 연습실 무료 대여까지. 목표가 무엇이든 끝까지 함께 성장합니다.",
    ctaLabel: "무료 체험레슨 신청",
    ctaHref: "/apply",
  },
];

const FALLBACK_REVIEWS = [
  {
    studentName: "박○○",
    studentInfo: "취미 보컬 · 5개월차",
    rating: 5,
    body: "발성부터 다시 잡아주셔서 노래할 때 목이 금방 피곤하던 게 사라졌어요. 불필요한 연습 없이 필요한 것만 콕콕 짚어주시는 게 좋아요.",
  },
  {
    studentName: "정○○",
    studentInfo: "믹스보이스 · 8개월차",
    rating: 5,
    body: "직장 다니면서 주 1회 다니는데도 시간 대비 효과가 확실해요. 매번 녹음해서 피드백을 주시니까 집에서 연습하기도 편해요.",
  },
  {
    studentName: "최○○",
    studentInfo: "실용음악 입시 · 합격생",
    rating: 5,
    body: "입시 준비로 와서 담임 선생님이 끝까지 챙겨주셨어요. 계획표대로 진도가 나가서 불안하지 않고 준비할 수 있었습니다.",
  },
];

const FALLBACK_WHY = [
  { number: "01", title: "Time Save 커리큘럼", description: "음역대·목표를 진단해, 돌아가지 않고 최단 시간에 도달하는 레슨 플랜을 설계합니다." },
  { number: "02", title: "분야별 최정예 강사진", description: "보컬·뮤지컬·성악·피아노·작곡 각 분야 전문 강사가 직접 지도합니다." },
  { number: "03", title: "담임 강사 시스템", description: "한 명의 담임이 끝까지 책임지고 성장 과정을 함께합니다." },
  { number: "04", title: "다양한 레슨 과목", description: "발성교정·믹스보이스부터 입시·실용음악까지 폭넓게 다룹니다." },
  { number: "05", title: "넓고 쾌적한 레슨실", description: "방음·음향이 갖춰진 독립 레슨실에서 집중해 배웁니다." },
  { number: "06", title: "연습실 무료 대여", description: "수강생이라면 언제든 연습실을 무료로 사용할 수 있습니다." },
];

const FALLBACK_CURRICULUM = [
  { number: "01", title: "음성 진단", description: "음역대·호흡·발성 습관을 진단하고 목표를 설정합니다." },
  { number: "02", title: "발성 교정", description: "호흡 지지와 후두 안정으로 무리 없는 소리의 기초를 잡습니다." },
  { number: "03", title: "믹스보이스", description: "흉성과 두성을 연결해 편안한 고음과 음색을 확장합니다." },
  { number: "04", title: "곡 적용 · 완성", description: "원하는 곡에 테크닉을 적용해 무대에서 쓸 수 있게 완성합니다." },
];

const FALLBACK_CLASSES = [
  {
    badge: "Hobby",
    name: "취미반",
    forWhom: "노래가 좋아서 시작하는 분",
    features: ["스트레스 없이 즐기는 1:1 레슨", "좋아하는 곡 중심 진행", "발성 기초 + 음정·박자 교정"],
    frequency: "주 1회",
    sessionLength: "회당 50분",
    featured: false,
  },
  {
    badge: "Pro · 추천",
    name: "실력 향상반",
    forWhom: "제대로 배우고 싶은 분",
    features: ["믹스보이스 집중 트레이닝", "매 수업 녹음 + 피드백", "연습실 무료 대여", "담임 강사 책임 관리"],
    frequency: "주 1~2회",
    sessionLength: "회당 50분",
    featured: true,
  },
  {
    badge: "Admission",
    name: "입시반",
    forWhom: "실용음악과 진학 준비생",
    features: ["지정곡·자유곡 완성", "시창청음 · 코드 반주 병행", "입시 일정 맞춤 플랜"],
    frequency: "주 2회+",
    sessionLength: "맞춤 편성",
    featured: false,
  },
];

const FALLBACK_TEACHING = [
  { icon: "◎", title: "1:1 개인 맞춤", description: "그룹이 아닌 개인 레슨으로, 나의 음색과 진도에 맞춰 진행합니다." },
  { icon: "●", title: "매 수업 녹음", description: "레슨을 녹음해 변화를 직접 확인하고 복습할 수 있습니다." },
  { icon: "♪", title: "연습실 무료 대여", description: "수강생은 빈 시간 연습실을 무료로 사용할 수 있습니다." },
  { icon: "✦", title: "담임 책임 관리", description: "한 명의 담임 강사가 목표 달성까지 함께합니다." },
];

const FALLBACK_BEFORE_AFTER = [
  {
    initial: "K",
    studentName: "30대 직장인 · 김○○",
    studentInfo: "취미반 · 수강 3개월",
    metrics: [
      { label: "최고음 음역대", change: "+5키", before: 45, after: 78 },
      { label: "호흡 지지력", change: "향상", before: 50, after: 82 },
      { label: "믹스보이스", change: "안정화", before: 28, after: 72 },
    ],
    quote: "“고음만 가면 갈라졌는데, 이제 목에 힘 안 주고도 편하게 올라가요.”",
  },
  {
    initial: "L",
    studentName: "입시 준비생 · 이○○",
    studentInfo: "입시반 · 수강 6개월",
    metrics: [
      { label: "음정 안정도", change: "+↑", before: 55, after: 88 },
      { label: "성량 · 발성", change: "향상", before: 48, after: 84 },
      { label: "고음 발성", change: "+4키", before: 38, after: 80 },
    ],
    quote: "“6개월 만에 원하던 학교 실기 기준을 넘겨서 합격했어요.”",
  },
];

const FALLBACK_TEACHERS = [
  {
    name: "MASTER · J",
    role: "Vocal / Educator",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "수창 · SOOCHANG",
    role: "Musical / Vocal",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "예인 · YEIN",
    role: "Classic / Vocal",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "예진 · YEJIN",
    role: "Piano / Songwriting",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [academy, teachersDb, reviewsDb, bannersDb, whyDb, curriculumDb, classesDb, teachingDb, beforeAfterDb] =
    await Promise.all([
      getAcademy().catch(() => null),
      listTeachers().catch(() => []),
      listReviews().catch(() => []),
      listBanners().catch(() => []),
      listWhyFeatures().catch(() => []),
      listCurriculumSteps().catch(() => []),
      listClassOfferings().catch(() => []),
      listTeachingMethods().catch(() => []),
      listBeforeAfters().catch(() => []),
    ]);
  const activeBanners = bannersDb.filter((b) => b.active);
  const slides: HeroSlide[] =
    activeBanners.length > 0
      ? activeBanners.map((b) => ({
          bg: b.bgUrl?.trim() || (b.imageKey ? `${S3_BASE}/${encodeURI(b.imageKey)}` : ""),
          kicker: b.kicker || undefined,
          title: b.title,
          subtitle: b.subtitle || undefined,
          ctaLabel: b.ctaLabel || undefined,
          ctaHref: b.ctaHref || undefined,
        }))
      : FALLBACK_SLIDES;
  const activeTeachers = teachersDb.filter((t) => t.active);
  const teachers =
    activeTeachers.length > 0
      ? activeTeachers.map((t) => ({
          name: t.englishName ? `${t.name} · ${t.englishName}` : t.name,
          role: t.role,
          photoUrl: t.photoKey ? `${S3_BASE}/${encodeURI(t.photoKey)}` : "",
        }))
      : FALLBACK_TEACHERS;
  const activeWhy = whyDb.filter((w) => w.active);
  const whyFeatures = activeWhy.length > 0 ? activeWhy : FALLBACK_WHY;
  const activeCurriculum = curriculumDb.filter((c) => c.active);
  const curriculum = activeCurriculum.length > 0 ? activeCurriculum : FALLBACK_CURRICULUM;
  const activeClasses = classesDb.filter((c) => c.active);
  const classes = activeClasses.length > 0 ? activeClasses : FALLBACK_CLASSES;
  const activeTeaching = teachingDb.filter((t) => t.active);
  const teaching = activeTeaching.length > 0 ? activeTeaching : FALLBACK_TEACHING;
  const activeBeforeAfter = beforeAfterDb.filter((b) => b.active);
  const beforeAfter = activeBeforeAfter.length > 0 ? activeBeforeAfter : FALLBACK_BEFORE_AFTER;
  const visibleReviews = reviewsDb.filter((r) => r.visible);
  const reviews =
    visibleReviews.length > 0
      ? visibleReviews.map((r) => ({
          studentName: r.studentName,
          studentInfo: r.studentInfo ?? "",
          rating: Math.max(1, Math.min(5, r.rating || 5)),
          body: r.body,
        }))
      : FALLBACK_REVIEWS;
  const info = {
    name: academy?.name ?? "TS보컬학원",
    address: academy?.address ?? "서울 ○○구 ○○로 00, 0층 · ○○역 0번 출구 도보 5분",
    phone: academy?.phone ?? "070-0000-0000",
    hours: academy?.hours?.trim() || "평일 12:00 – 22:00 · 주말 11:00 – 18:00",
    naverCafeUrl: academy?.naverCafeUrl?.trim() || "https://cafe.naver.com",
    youtubeUrl: academy?.youtubeUrl?.trim() || "https://youtube.com",
    instagramUrl: academy?.instagramUrl?.trim() || "",
    mapEmbedUrl: academy?.mapEmbedUrl?.trim() || "",
    mapKakaoRoughKey: academy?.mapKakaoRoughKey?.trim() || "",
    mapKakaoRoughTimestamp: academy?.mapKakaoRoughTimestamp?.trim() || "",
  };
  return (
    <>
      <HeroBanner slides={slides} />

      <section className="block" id="why">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Why TS</span>
            <h2>잘 가르치는 데는 이유가 있습니다</h2>
            <p>한 명 한 명의 음색과 목표가 다르기에, 사람에 맞춘 시스템으로 레슨합니다.</p>
          </div>
          <div className="feat-grid">
            {whyFeatures.map((f, i) => (
              <div className="feat" key={`why-${i}`}>
                <div className="no">{f.number || String(i + 1).padStart(2, "0")}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="program" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Vocal Curriculum</span>
            <h2>Time Save 4단계 커리큘럼</h2>
            <p>믹스보이스 발성 · 미국 IVA · 세스릭스 발성법 · 음성 교정 · 뮤지컬·성악 · 실용음악 입시까지. 돌아가지 않도록 검증된 순서로 진행합니다.</p>
          </div>
          <div className="steps">
            {curriculum.map((c, i) => (
              <div className="step" key={`step-${i}`}>
                <div className="n">{c.number || String(i + 1).padStart(2, "0")}</div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="classes" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Classes</span>
            <h2>대상별 반</h2>
            <p>취미부터 입시·프로까지, 목표에 맞는 반으로 시작하세요.</p>
          </div>
          <div className="cls-grid">
            {classes.map((c, i) => (
              <div className={c.featured ? "cls feature" : "cls"} key={`cls-${i}`}>
                {c.badge && <div className="badge">{c.badge}</div>}
                <h3>{c.name}</h3>
                {c.forWhom && <div className="for">{c.forWhom}</div>}
                <ul>
                  {c.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
                <div className="price">
                  {c.frequency && <b>{c.frequency}</b>}
                  {c.sessionLength && <span> / {c.sessionLength}</span>}
                </div>
                <a className="btn btn-primary" href="/apply">
                  체험 신청
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="how" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How we teach</span>
            <h2>수업은 이렇게 진행돼요</h2>
          </div>
          <div className="how-grid">
            {teaching.map((t, i) => (
              <div className="how" key={`how-${i}`}>
                <div className="ic">{t.icon}</div>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="teachers" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Instructors</span>
            <h2>나를 성장시킬 강사진</h2>
            <p>실력과 티칭을 모두 갖춘 강사들이 함께합니다.</p>
          </div>
          <div className="ins-grid">
            {teachers.map((t, i) => (
              <div className="ins" key={`${t.name}-${i}`}>
                <div className="pic">
                  {t.photoUrl ? (
                    <img className="fill-slot" src={t.photoUrl} alt={`${t.name} 강사 사진`} />
                  ) : null}
                </div>
                <div className="meta">
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="change" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Before &amp; After</span>
            <h2>짧은 시간, 분명한 변화</h2>
            <p>입학 시점과 수강 후의 음성 변화입니다. 같은 곡·같은 키로 부른 결과를 비교합니다.</p>
          </div>
          <div className="ba-grid">
            {beforeAfter.map((b, i) => (
              <div className="ba-card" key={`ba-${i}`}>
                <div className="ba-top">
                  <div className="who">{b.initial || b.studentName.charAt(0)}</div>
                  <div>
                    <b>{b.studentName}</b>
                    {b.studentInfo && <span>{b.studentInfo}</span>}
                  </div>
                </div>
                {b.metrics.map((m, j) => (
                  <div className="ba-metric" key={j}>
                    <div className="lab">
                      <span>{m.label}</span>
                      <em>{m.change}</em>
                    </div>
                    <div className="ba-track">
                      <span className="after" style={{ width: `${Math.max(0, Math.min(100, m.after))}%` }} />
                      <span className="before" style={{ width: `${Math.max(0, Math.min(100, m.before))}%` }} />
                    </div>
                  </div>
                ))}
                {b.quote && <div className="ba-quote">{b.quote}</div>}
              </div>
            ))}
          </div>
          <div className="ba-legend">
            <span>
              <i style={{ background: "#48564c" }} />
              입학 시
            </span>
            <span>
              <i style={{ background: "#c9a86a" }} />
              수강 후
            </span>
          </div>
        </div>
      </section>

      <section className="block" id="review" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Review</span>
            <h2>수강생들의 이야기</h2>
            <p>TS보컬학원을 먼저 경험한 분들의 솔직한 후기입니다.</p>
          </div>
          <div className="rev-grid">
            {reviews.map((r, i) => (
              <div className="rev" key={`${r.studentName}-${i}`}>
                <div className="stars" aria-label={`${r.rating}점`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <q>{r.body}</q>
                <div className="by">
                  <div className="av">{r.studentName.charAt(0)}</div>
                  <div>
                    <b>{maskStudentName(r.studentName)}</b>
                    {r.studentInfo && <span>{r.studentInfo}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <span className="eyebrow">Free Trial</span>
            <h2>
              첫 1:1 체험레슨,<br />
              지금 무료로 시작하세요
            </h2>
            <p>취미반 · 프로반 · 티처트레이닝 모두 체험 가능합니다.</p>
            <a className="btn btn-primary" href="/apply">
              무료 체험레슨 신청
            </a>
          </div>
        </div>
      </section>

      <section className="block" id="contact" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Contact</span>
            <h2>오시는 길</h2>
          </div>
          <div className="contact-grid">
            <div className="map-ph">
              {info.mapKakaoRoughKey && info.mapKakaoRoughTimestamp ? (
                <KakaoRoughMap
                  timestamp={info.mapKakaoRoughTimestamp}
                  mapKey={info.mapKakaoRoughKey}
                />
              ) : info.mapEmbedUrl ? (
                <iframe
                  src={info.mapEmbedUrl}
                  title={`${info.name} 위치 지도`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              ) : (
                <>
                  <span className="lbl">지도 영역 (어드민 → 학원 기본정보에서 지도 코드 등록)</span>
                  <span className="pin" />
                </>
              )}
            </div>
            <div className="contact-info">
              <h3>{info.name}</h3>
              <div className="info-row">
                <span className="k">주소</span>
                <span>{info.address}</span>
              </div>
              <div className="info-row">
                <span className="k">전화</span>
                <span>{info.phone}</span>
              </div>
              <div className="info-row">
                <span className="k">시간</span>
                <span>{info.hours}</span>
              </div>
              <div className="info-row">
                <span className="k">SNS</span>
                <span>네이버 카페 · 유튜브 · 인스타그램 · 블로그</span>
              </div>
              <div className="soc-group">
                <a className="soc-btn naver" href={info.naverCafeUrl} target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h6.4l4.2 6.1V3H21v18h-6.4l-4.2-6.1V21H3V3z" />
                  </svg>
                  네이버 카페
                </a>
                <a className="soc-btn youtube" href={info.youtubeUrl} target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
                  </svg>
                  유튜브 채널
                </a>
              </div>
              <a className="btn btn-primary" href="#">
                카카오톡으로 상담하기
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
