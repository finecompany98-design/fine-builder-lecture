import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🏆',
    label: '01',
    title: '공모·지원사업 탐색',
    desc: '한국문화예술위원회, 서울문화재단 등 공공기관의 실제 공모전과 지원사업을 한눈에 확인하세요.',
    to: '/competitions',
    cta: '공모 찾아보기',
  },
  {
    icon: '✨',
    label: '02',
    title: 'AI 맞춤 추천',
    desc: '분야·경력·유형을 선택하면 나에게 맞는 지원사업과 공모전을 AI가 골라드립니다.',
    to: '/ai-recommend',
    cta: 'AI 추천 받기',
  },
  {
    icon: '📅',
    label: '03',
    title: '마감 D-Day 관리',
    desc: '관심 공모의 마감일을 D-Day 배지로 한눈에 파악하고, 지원 기회를 놓치지 마세요.',
    to: '/competitions',
    cta: '지금 확인하기',
  },
]

const STATS = [
  { num: '14+', label: '등록된 공모·지원사업' },
  { num: '8', label: '지원 예술 분야' },
  { num: '6', label: '파트너 공공기관·재단' },
]

const STEPS = [
  { n: '01', title: '분야 선택', desc: '시각예술, 공연, 문학 등 내 분야를 선택하세요.' },
  { n: '02', title: '공모 탐색', desc: '필터와 검색으로 딱 맞는 공모·지원사업을 찾으세요.' },
  { n: '03', title: '지원 신청', desc: '공식 사이트로 바로 이동해 지원하세요.' },
]

export default function Home() {
  return (
    <main id="main">

      {/* 히어로 */}
      <section style={s.hero} aria-labelledby="hero-title">
        {/* 배경 장식 */}
        <div style={s.heroBgCircle1} aria-hidden="true" />
        <div style={s.heroBgCircle2} aria-hidden="true" />

        <div style={s.heroInner}>
          {/* 상단 태그 */}
          <div style={s.heroTagRow}>
            <span style={s.heroTag}>
              <span style={s.heroDot} />
              문화예술 플랫폼
            </span>
          </div>

          {/* 제목 */}
          <h1 id="hero-title" style={s.heroTitle}>
            예술가의 다음 무대,<br />
            <span style={s.highlight}>fine:D</span>에서 찾으세요
          </h1>

          {/* 설명 */}
          <p style={s.heroDesc}>
            공공기관·재단의 공모전과 지원사업 정보를 한데 모아<br />
            AI가 내 분야에 꼭 맞게 추천해드립니다
          </p>

          {/* CTA 버튼 */}
          <div style={s.ctaRow}>
            <Link to="/auth" style={s.ctaPrimary}>
              시작하기
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 6 }} aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/ai-recommend" style={s.ctaSecondary}>
              ✨ AI 맞춤 추천
            </Link>
          </div>

          {/* 통계 인라인 */}
          <div style={s.heroStats}>
            {STATS.map(({ num, label }, i) => (
              <div key={label} style={s.heroStatItem}>
                <strong style={s.heroStatNum}>{num}</strong>
                <span style={s.heroStatLabel}>{label}</span>
                {i < STATS.length - 1 && <span style={s.statDivider} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section style={s.section} aria-labelledby="features-title">
        <div style={s.sectionInner}>
          <div style={s.sectionHeader}>
            <span style={s.sectionEyebrow}>Features</span>
            <h2 id="features-title" style={s.sectionTitle}>fine:D가 하는 일</h2>
            <p style={s.sectionSub}>복잡한 지원 정보를 쉽고 빠르게</p>
          </div>
          <div style={s.featureGrid}>
            {FEATURES.map(({ icon, label, title, desc, to, cta }) => (
              <div key={title} style={s.featureCard}>
                <div style={s.featureCardTop}>
                  <span style={s.featureLabel}>{label}</span>
                  <span style={s.featureIcon} aria-hidden="true">{icon}</span>
                </div>
                <h3 style={s.featureTitle}>{title}</h3>
                <p style={s.featureDesc}>{desc}</p>
                <Link to={to} style={s.featureLink}>
                  {cta}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }} aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 흐름 */}
      <section style={s.stepsSection} aria-labelledby="steps-title">
        <div style={s.sectionInner}>
          <div style={s.sectionHeader}>
            <span style={s.sectionEyebrow}>How it works</span>
            <h2 id="steps-title" style={s.sectionTitle}>이렇게 사용하세요</h2>
            <p style={s.sectionSub}>3단계로 간편하게</p>
          </div>
          <div style={s.stepsGrid}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} style={s.step}>
                <span style={s.stepNum} aria-hidden="true">{n}</span>
                <strong style={s.stepTitle}>{title}</strong>
                <p style={s.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section style={s.bottomCta} aria-labelledby="cta-title">
        <div style={s.bottomCtaInner}>
          <div style={s.ctaBadge}>지금 바로 시작</div>
          <h2 id="cta-title" style={s.ctaTitle}>
            당신의 예술을<br />
            <em style={s.ctaTitleEmphasis}>Fine하게</em> 빛내세요
          </h2>
          <p style={s.ctaDesc}>
            내 분야에 맞는 공모와 지원사업을 AI가 추천해드립니다
          </p>
          <div style={s.ctaBtnRow}>
            <Link to="/competitions" style={s.ctaBtnAccent}>공모·지원사업 보기</Link>
            <Link to="/ai-recommend" style={s.ctaBtnGhost}>AI 추천 받기 →</Link>
          </div>
        </div>
      </section>

    </main>
  )
}

const ACCENT = '#3747FF'
const ACCENT_HOVER = '#2535E8'

const s = {
  /* ── 히어로 ── */
  hero: {
    padding: '116px 28px 80px',
    background: '#FAFAF9',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBgCircle1: {
    position: 'absolute', top: '-10%', right: '-8%',
    width: 560, height: 560, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(55,71,255,0.07) 0%, transparent 68%)',
    pointerEvents: 'none',
  },
  heroBgCircle2: {
    position: 'absolute', bottom: '-15%', left: '-5%',
    width: 360, height: 360, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroInner: { maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' },
  heroTagRow: { marginBottom: 28 },
  heroTag: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: 'rgba(55,71,255,0.07)',
    border: '1px solid rgba(55,71,255,0.18)',
    color: ACCENT,
    padding: '5px 14px', borderRadius: 40,
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  heroDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: ACCENT, flexShrink: 0,
    boxShadow: `0 0 6px ${ACCENT}`,
  },
  heroTitle: {
    fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
    fontWeight: 900, lineHeight: 1.14,
    letterSpacing: '-2px',
    color: '#0D0D0D', marginBottom: 22,
  },
  highlight: { color: ACCENT },
  heroDesc: {
    fontSize: 'clamp(15px, 1.8vw, 17px)',
    color: '#8A8A8A', lineHeight: 1.9,
    marginBottom: 40, fontWeight: 400,
  },
  ctaRow: {
    display: 'flex', gap: 12,
    justifyContent: 'center', flexWrap: 'wrap',
    marginBottom: 52,
  },
  ctaPrimary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 28px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.95rem',
    boxShadow: '0 4px 20px rgba(55,71,255,0.28)',
    letterSpacing: '-0.2px',
    transition: 'background 0.15s, transform 0.1s',
  },
  ctaSecondary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 28px', borderRadius: 40,
    background: '#fff', color: '#0D0D0D',
    fontWeight: 700, fontSize: '0.95rem',
    border: '1.5px solid rgba(0,0,0,0.15)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    letterSpacing: '-0.2px',
  },

  /* 히어로 통계 */
  heroStats: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: 0,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.09)',
    borderRadius: 18, padding: '20px 36px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    flexWrap: 'wrap',
    maxWidth: 520, margin: '0 auto',
  },
  heroStatItem: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '0 28px',
    position: 'relative',
  },
  heroStatNum: {
    display: 'block',
    fontSize: '1.9rem', fontWeight: 900,
    color: '#0D0D0D', letterSpacing: '-1px',
  },
  heroStatLabel: {
    display: 'block',
    fontSize: '11px', color: '#8A8A8A',
    marginTop: 3, fontWeight: 500,
  },
  statDivider: {
    position: 'absolute', right: 0, top: '15%',
    width: 1, height: '70%',
    background: 'rgba(0,0,0,0.1)',
  },

  /* ── 공통 섹션 ── */
  section: { padding: '88px 28px', background: '#fff' },
  stepsSection: { padding: '88px 28px', background: '#F4F4F2' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: 52 },
  sectionEyebrow: {
    display: 'inline-block',
    fontSize: '11px', fontWeight: 700,
    color: ACCENT, letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', marginBottom: 8,
  },
  sectionSub: { fontSize: '14px', color: '#8A8A8A' },

  /* ── 기능 카드 ── */
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
  },
  featureCard: {
    background: '#FAFAF9',
    borderRadius: 20,
    padding: '32px 28px',
    border: '1px solid rgba(0,0,0,0.08)',
    borderTop: `3px solid ${ACCENT}`,
    display: 'flex', flexDirection: 'column',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  featureCardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
  },
  featureLabel: {
    fontSize: '11px', fontWeight: 700,
    color: '#B0B0B0', letterSpacing: '0.05em',
  },
  featureIcon: { fontSize: '2rem', lineHeight: 1 },
  featureTitle: {
    fontSize: '1.05rem', fontWeight: 800,
    color: '#0D0D0D', marginBottom: 10,
    letterSpacing: '-0.3px',
  },
  featureDesc: {
    fontSize: '0.875rem', color: '#7A7A7A',
    lineHeight: 1.8, marginBottom: 24, flex: 1,
  },
  featureLink: {
    display: 'inline-flex', alignItems: 'center',
    color: ACCENT, fontWeight: 700,
    fontSize: '0.875rem', letterSpacing: '-0.2px',
    marginTop: 'auto',
  },

  /* ── 이용 흐름 ── */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },
  step: {
    background: '#fff', borderRadius: 20,
    padding: '32px 26px',
    border: '1px solid rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column',
    gap: 12,
    transition: 'box-shadow 0.2s',
  },
  stepNum: {
    display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center',
    width: 44, height: 44, borderRadius: '50%',
    background: '#0D0D0D', color: '#fff',
    fontWeight: 900, fontSize: '0.85rem',
    letterSpacing: '0.02em',
    flexShrink: 0, alignSelf: 'flex-start',
  },
  stepTitle: {
    fontSize: '1rem', fontWeight: 800,
    color: '#0D0D0D', letterSpacing: '-0.3px',
  },
  stepDesc: { fontSize: '0.875rem', color: '#7A7A7A', lineHeight: 1.75 },

  /* ── 하단 CTA ── */
  bottomCta: {
    padding: '96px 28px',
    background: '#0A0A0A',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bottomCtaInner: { maxWidth: 600, margin: '0 auto', position: 'relative' },
  ctaBadge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(55,71,255,0.15)',
    border: '1px solid rgba(55,71,255,0.3)',
    color: ACCENT, padding: '5px 14px',
    borderRadius: 40, fontSize: '11px',
    fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 24,
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
    fontWeight: 900, color: '#fff',
    letterSpacing: '-1.5px', lineHeight: 1.18,
    marginBottom: 18,
    fontStyle: 'normal',
  },
  ctaTitleEmphasis: {
    color: ACCENT,
    fontStyle: 'normal',
  },
  ctaDesc: {
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 40, fontSize: '15px',
    lineHeight: 1.7,
  },
  ctaBtnRow: {
    display: 'flex', gap: 14,
    justifyContent: 'center', flexWrap: 'wrap',
  },
  ctaBtnAccent: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 30px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.95rem',
    boxShadow: '0 4px 24px rgba(55,71,255,0.28)',
    letterSpacing: '-0.2px',
  },
  ctaBtnGhost: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 30px', borderRadius: 40,
    background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 600, fontSize: '0.95rem',
    letterSpacing: '-0.2px',
  },
}
