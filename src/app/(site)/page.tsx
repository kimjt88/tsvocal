/* eslint-disable @next/next/no-img-element */
import { HeroBanner } from "../_components/hero-banner";
import { KakaoRoughMap } from "../_components/kakao-rough-map";
import { getAcademy } from "@/lib/repositories/academy";
import { listTeachers } from "@/lib/repositories/teachers";

const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL ?? "";

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
  const [academy, teachersDb] = await Promise.all([
    getAcademy().catch(() => null),
    listTeachers().catch(() => []),
  ]);
  const activeTeachers = teachersDb.filter((t) => t.active);
  const teachers =
    activeTeachers.length > 0
      ? activeTeachers.map((t) => ({
          name: t.englishName ? `${t.name} · ${t.englishName}` : t.name,
          role: t.role,
          photoUrl: t.photoKey ? `${S3_BASE}/${encodeURI(t.photoKey)}` : "",
        }))
      : FALLBACK_TEACHERS;
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
      <HeroBanner />

      <section className="block" id="why">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Why TS</span>
            <h2>잘 가르치는 데는 이유가 있습니다</h2>
            <p>한 명 한 명의 음색과 목표가 다르기에, 사람에 맞춘 시스템으로 레슨합니다.</p>
          </div>
          <div className="feat-grid">
            <div className="feat">
              <div className="no">01</div>
              <h3>Time Save 커리큘럼</h3>
              <p>음역대·목표를 진단해, 돌아가지 않고 최단 시간에 도달하는 레슨 플랜을 설계합니다.</p>
            </div>
            <div className="feat">
              <div className="no">02</div>
              <h3>분야별 최정예 강사진</h3>
              <p>보컬·뮤지컬·성악·피아노·작곡 각 분야 전문 강사가 직접 지도합니다.</p>
            </div>
            <div className="feat">
              <div className="no">03</div>
              <h3>담임 강사 시스템</h3>
              <p>한 명의 담임이 끝까지 책임지고 성장 과정을 함께합니다.</p>
            </div>
            <div className="feat">
              <div className="no">04</div>
              <h3>다양한 레슨 과목</h3>
              <p>발성교정·믹스보이스부터 입시·실용음악까지 폭넓게 다룹니다.</p>
            </div>
            <div className="feat">
              <div className="no">05</div>
              <h3>넓고 쾌적한 레슨실</h3>
              <p>방음·음향이 갖춰진 독립 레슨실에서 집중해 배웁니다.</p>
            </div>
            <div className="feat">
              <div className="no">06</div>
              <h3>연습실 무료 대여</h3>
              <p>수강생이라면 언제든 연습실을 무료로 사용할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="program" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Program</span>
            <h2>무엇을 배우고 싶으세요?</h2>
            <p>취미반과 프로/입시반을 모두 운영합니다.</p>
          </div>
          <div className="prog-list">
            <a className="prog-row" href="#">
              <div className="no">01</div>
              <h3>
                보컬<small>Vocal</small>
              </h3>
              <div className="desc">믹스보이스 발성 · 미국 IVA · 세스릭스 발성법 · 뮤지컬 · 성악 · 음성 교정</div>
              <div className="go">자세히 →</div>
            </a>
            <a className="prog-row" href="#">
              <div className="no">02</div>
              <h3>
                피아노<small>Piano</small>
              </h3>
              <div className="desc">재즈 · 클래식 · 반주법(가요·팝·CCM) · 시창청음</div>
              <div className="go">자세히 →</div>
            </a>
            <a className="prog-row" href="#">
              <div className="no">03</div>
              <h3>
                작곡<small>Songwriting</small>
              </h3>
              <div className="desc">가요 · 팝 · 뮤지컬 · CCM · 싱어송라이터 · 미디</div>
              <div className="go">자세히 →</div>
            </a>
            <a className="prog-row" href="#">
              <div className="no">04</div>
              <h3>
                보컬 트레이닝<small>Teacher Training</small>
              </h3>
              <div className="desc">TS 보컬 테크닉 교수법 · 보컬 트레이너 양성</div>
              <div className="go">자세히 →</div>
            </a>
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
            <div className="ba-card">
              <div className="ba-top">
                <div className="who">K</div>
                <div>
                  <b>30대 직장인 · 김○○</b>
                  <span>취미반 · 수강 3개월</span>
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>최고음 음역대</span>
                  <em>+5키</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "78%" }} />
                  <span className="before" style={{ width: "45%" }} />
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>호흡 지지력</span>
                  <em>향상</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "82%" }} />
                  <span className="before" style={{ width: "50%" }} />
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>믹스보이스</span>
                  <em>안정화</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "72%" }} />
                  <span className="before" style={{ width: "28%" }} />
                </div>
              </div>
              <div className="ba-quote">
                “고음만 가면 갈라졌는데, 이제 목에 힘 안 주고도 편하게 올라가요.”
              </div>
            </div>
            <div className="ba-card">
              <div className="ba-top">
                <div className="who">L</div>
                <div>
                  <b>입시 준비생 · 이○○</b>
                  <span>입시반 · 수강 6개월</span>
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>음정 안정도</span>
                  <em>+↑</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "88%" }} />
                  <span className="before" style={{ width: "55%" }} />
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>성량 · 발성</span>
                  <em>향상</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "84%" }} />
                  <span className="before" style={{ width: "48%" }} />
                </div>
              </div>
              <div className="ba-metric">
                <div className="lab">
                  <span>고음 발성</span>
                  <em>+4키</em>
                </div>
                <div className="ba-track">
                  <span className="after" style={{ width: "80%" }} />
                  <span className="before" style={{ width: "38%" }} />
                </div>
              </div>
              <div className="ba-quote">
                “6개월 만에 원하던 학교 실기 기준을 넘겨서 합격했어요.”
              </div>
            </div>
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
          <p className="ba-note">* 위 수치는 이해를 돕기 위한 예시입니다. 실제 수강생 데이터·음성 샘플로 교체할 수 있어요.</p>
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
            <div className="rev">
              <div className="stars">★★★★★</div>
              <q>
                발성부터 다시 잡아주셔서 노래할 때 목이 금방 피곤하던 게 사라졌어요. 불필요한 연습 없이 필요한 것만 콕콕 짚어주시는 게 좋아요.
              </q>
              <div className="by">
                <div className="av">P</div>
                <div>
                  <b>박○○</b>
                  <span>취미 보컬 · 5개월차</span>
                </div>
              </div>
            </div>
            <div className="rev">
              <div className="stars">★★★★★</div>
              <q>
                직장 다니면서 주 1회 다니는데도 시간 대비 효과가 확실해요. 매번 녹음해서 피드백을 주시니까 집에서 연습하기도 편해요.
              </q>
              <div className="by">
                <div className="av">J</div>
                <div>
                  <b>정○○</b>
                  <span>믹스보이스 · 8개월차</span>
                </div>
              </div>
            </div>
            <div className="rev">
              <div className="stars">★★★★★</div>
              <q>
                입시 준비로 와서 담임 선생님이 끝까지 챙겨주셨어요. 계획표대로 진도가 나가서 불안하지 않고 준비할 수 있었습니다.
              </q>
              <div className="by">
                <div className="av">C</div>
                <div>
                  <b>최○○</b>
                  <span>실용음악 입시 · 합격생</span>
                </div>
              </div>
            </div>
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
            <a className="btn btn-primary" href="#contact">
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
