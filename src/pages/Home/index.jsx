import { Link } from 'react-router-dom'
import './Home.css'

const ACCENT = '#3747FF'

const FEATURES = [
  {
    label: '01',
    title: '공모·지원사업 탐색',
    desc: '한국문화예술위원회, 서울문화재단 등 공공기관의 공모전과 지원사업을 한 곳에 모았습니다.',
    to: '/competitions',
    cta: '공모 찾아보기',
    tag: 'SEARCH',
  },
  {
    label: '02',
    title: 'fine:D 맞춤 추천',
    desc: '분야·경력·지원 목적을 입력하면 fine:D가 조건에 맞는 공모를 직접 골라드립니다.',
    to: '/ai-recommend',
    cta: '맞춤 추천 받기',
    tag: 'PICK',
  },
  {
    label: '03',
    title: '마감 임박 알림',
    desc: '관심 공모의 마감이 다가오면 fine:D가 먼저 알려드립니다. 소중한 기회를 놓치지 마세요.',
    to: '/competitions',
    cta: '공모 살펴보기',
    tag: 'ALERT',
  },
  {
    label: '04',
    title: '활동 이력 기반 매칭',
    desc: '분야·장르·경력을 등록해두면 새로운 공모가 올라올 때 fine:D가 자동으로 연결해드립니다.',
    to: '/auth',
    cta: '이력 등록하기',
    tag: 'MATCH',
  },
  {
    label: '05',
    title: '관심 공모 북마크',
    desc: '마음에 드는 공모를 저장하고 한곳에서 모아 관리하세요. 로그인하면 내 리스트가 만들어집니다.',
    to: '/auth',
    cta: '로그인하기',
    tag: 'SAVE',
  },
  {
    label: '06',
    title: '지원 자격 자동 확인',
    desc: '신분·경력·예술활동증명 여부를 입력하면 지원 가능한 공모만 걸러서 보여드립니다.',
    to: '/ai-recommend',
    cta: '자격 확인하기',
    tag: 'CHECK',
  },
]

const STATS = [
  { num: '14+', label: '등록된 공모·지원사업', sub: 'Registered' },
  { num: '8', label: '지원 예술 분야', sub: 'Categories' },
  { num: '6', label: '함께 살펴보는 기관', sub: 'Institutions' },
]

const STEPS = [
  { n: '01', title: '분야 선택', desc: '시각예술, 공연, 문학 등 내 분야를 선택하세요.' },
  { n: '02', title: '공모 탐색', desc: '필터와 검색으로 딱 맞는 공모·지원사업을 찾으세요.' },
  { n: '03', title: '지원 신청', desc: '공식 사이트로 바로 이동해 지원하세요.' },
]

const TICKER_ITEMS = [
  '시각예술', '공연예술', '문학', '음악', '무용', '미술', '사진', '영화·영상',
  '공공기관 공모', 'AI 추천', '지원사업', 'D-Day 알림',
]

export default function Home() {
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <main id="main">

      {/* ── 히어로 ── */}
      <section className="home-hero" style={s.hero} aria-labelledby="hero-title">
        {/* 배경 그리드 패턴 */}
        <div style={s.bgGrid} aria-hidden="true" />
        {/* 인디고 글로우 */}
        <div style={s.bgGlow} aria-hidden="true" />

        <div className="home-hero-grid" style={s.heroGrid}>

          {/* 왼쪽: 텍스트 */}
          <div style={s.heroLeft}>
            <span className="fade-up-1 home-hero-eyebrow" style={s.heroEyebrow}>
              <span className="glow-dot" style={s.heroDot} />
              문화예술 플랫폼 · fine:D
            </span>

            <h1 id="hero-title" className="fade-up-2 home-hero-title" style={s.heroTitle}>
              당신의 예술은{' '}
              <span style={s.accentWord}>'Fine'</span>하게,
              <br />
              당신의 내일은 우리가{' '}
              <span style={s.accentWord}>'Find'</span>하게.
            </h1>

            <p className="fade-up-3 home-hero-desc" style={s.heroDesc}>
              공공기관·재단의 공모전과 지원사업 정보를 한데 모아<br />
              fine:D가 내 분야에 꼭 맞는 기회를 찾아드립니다
            </p>

            <div className="fade-up-4 home-cta-row" style={s.ctaRow}>
              <Link to="/auth" style={s.ctaPrimary}>
                로그인
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 7 }} aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/ai-recommend" style={s.ctaSecondary}>
                ✦ fine:D 맞춤 추천
              </Link>
            </div>
          </div>

          {/* 오른쪽: 스탯 카드 */}
          <div className="fade-up-3 home-hero-right" style={s.heroRight} aria-label="서비스 현황">
            {STATS.map(({ num, label, sub }, i) => (
              <div
                key={label}
                className="home-card home-stat-card"
                style={{
                  ...s.statCard,
                  marginTop: i === 1 ? 20 : i === 2 ? -10 : 0,
                  background: i === 0 ? ACCENT : '#fff',
                  color: i === 0 ? '#fff' : '#0D0D0D',
                }}
              >
                <span className="home-stat-num" style={{ ...s.statNum, color: i === 0 ? '#fff' : ACCENT }}>{num}</span>
                <span style={{ ...s.statLabel, color: i === 0 ? 'rgba(255,255,255,0.75)' : '#6A6A6A' }}>{label}</span>
                <span style={{ ...s.statSub, color: i === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }}>{sub}</span>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ── 기능 소개 (에디토리얼 리스트) ── */}
      <section className="home-feat-section" style={s.featSection} aria-labelledby="features-title">
        <div style={s.sectionInner}>

          <div className="home-feat-header" style={s.featHeader}>
            <div>
              <p style={s.eyebrow}>Features</p>
              <h2 id="features-title" className="home-section-title" style={s.sectionTitle}>fine:D가 하는 일</h2>
            </div>
            <p className="home-feat-header-desc" style={s.featHeaderDesc}>복잡한 지원 정보를<br />쉽고 빠르게</p>
          </div>

          <div className="home-feat-grid" style={s.featGrid}>
            {FEATURES.map(({ label, title, desc, to, cta, tag }) => (
              <div key={label} className="home-card" style={s.featCard}>
                <div style={s.featCardTop}>
                  <span style={s.featNum}>{label}</span>
                  <span style={s.featTag}>{tag}</span>
                </div>
                <h3 style={s.featTitle}>{title}</h3>
                <p style={s.featDesc}>{desc}</p>
                <Link to={to} style={s.featCta}>
                  <span>{cta}</span>
                  <span className="feat-arrow" style={s.featArrow}>→</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 이용 흐름 ── */}
      <section className="home-steps-section" style={s.stepsSection} aria-labelledby="steps-title">
        <div style={s.sectionInner}>
          <div style={s.stepsHeader}>
            <p style={{ ...s.eyebrow, color: 'rgba(255,255,255,0.4)' }}>How it works</p>
            <h2 id="steps-title" className="home-section-title" style={{ ...s.sectionTitle, color: '#fff' }}>3단계로 간편하게</h2>
          </div>
          <div className="home-steps-grid" style={s.stepsGrid}>
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="home-card" style={s.stepCard}>
                <div style={s.stepTop}>
                  <span style={s.stepNum}>{n}</span>
                  {i < STEPS.length - 1 && (
                    <span className="home-step-connector" style={s.stepConnector} aria-hidden="true">───</span>
                  )}
                </div>
                <strong style={s.stepTitle}>{title}</strong>
                <p style={s.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 하단 CTA ── */}
      <section className="home-bottom-cta" style={s.bottomCta} aria-labelledby="cta-title">
        <div style={s.bottomCtaInner}>
          {/* 장식 텍스트 */}
          <p style={s.ctaDecor} aria-hidden="true">fine:D</p>
          <h2 id="cta-title" className="home-cta-title" style={s.ctaTitle}>
            지금 바로<br />
            <span style={s.ctaAccent}>시작하세요</span>
          </h2>
          <p style={s.ctaDesc}>
            내 분야에 맞는 공모와 지원사업을<br />fine:D가 전부 찾아드립니다
          </p>
          <div className="home-cta-btn-row" style={s.ctaBtnRow}>
            <Link to="/auth" style={s.ctaBtnPrimary}>시작하기 →</Link>
            <Link to="/competitions" style={s.ctaBtnGhost}>공모 둘러보기</Link>
          </div>
        </div>
      </section>

    </main>
  )
}

const s = {
  /* ── 히어로 ── */
  hero: {
    background: '#FAFAF9',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '92vh',
    display: 'flex',
    alignItems: 'center',
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
  },
  bgGlow: {
    position: 'absolute', top: '5%', right: '8%',
    width: 480, height: 480, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(55,71,255,0.10) 0%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  heroGrid: {
    position: 'relative',
  },
  heroLeft: { display: 'flex', flexDirection: 'column', gap: 0 },
  heroEyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(55,71,255,0.07)',
    border: '1px solid rgba(55,71,255,0.16)',
    color: ACCENT,
    padding: '5px 14px', borderRadius: 40,
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.07em', textTransform: 'uppercase',
    alignSelf: 'flex-start', marginBottom: 28,
  },
  heroDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: ACCENT, flexShrink: 0,
  },
  heroTitle: {
    fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
    fontWeight: 900, lineHeight: 1.13,
    letterSpacing: '-2.5px',
    color: '#0D0D0D', marginBottom: 26,
  },
  accentWord: {
    color: ACCENT,
    fontStyle: 'normal',
  },
  heroDesc: {
    fontSize: '16px', color: '#8A8A8A',
    lineHeight: 1.9, marginBottom: 36,
    fontWeight: 400,
  },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  ctaPrimary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 26px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.9rem',
    boxShadow: '0 4px 22px rgba(55,71,255,0.3)',
    letterSpacing: '-0.2px',
  },
  ctaSecondary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 26px', borderRadius: 40,
    background: '#fff', color: '#0D0D0D',
    fontWeight: 700, fontSize: '0.9rem',
    border: '1.5px solid rgba(0,0,0,0.12)',
    letterSpacing: '-0.2px',
  },

  /* 스탯 카드 (오른쪽) */
  heroRight: {},
  statCard: {
    borderRadius: 20, padding: '24px 26px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  statNum: { fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 },
  statLabel: { fontSize: '13px', fontWeight: 600, marginTop: 6 },
  statSub: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 },

  /* ── Features ── */
  featSection: { background: '#fff' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  eyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', lineHeight: 1.2,
  },
  featHeader: {},
  featHeaderDesc: { fontSize: '14px', color: '#9A9A9A', lineHeight: 1.7, textAlign: 'right' },
  featGrid: {},
  featCard: {
    background: '#FAFAF9',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 18, padding: '28px 26px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  featCardTop: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 4,
  },
  featNum: {
    fontSize: '11px', fontWeight: 700, color: '#C0C0C0',
    letterSpacing: '0.06em',
  },
  featTag: {
    fontSize: '10px', fontWeight: 700, color: ACCENT,
    background: 'rgba(55,71,255,0.08)',
    border: '1px solid rgba(55,71,255,0.15)',
    padding: '2px 9px', borderRadius: 20,
    letterSpacing: '0.05em',
  },
  featTitle: {
    fontSize: '1rem', fontWeight: 800, color: '#0D0D0D',
    letterSpacing: '-0.3px',
  },
  featDesc: {
    fontSize: '0.845rem', color: '#7A7A7A',
    lineHeight: 1.75, flex: 1,
  },
  featCta: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    color: '#0D0D0D', fontWeight: 700, fontSize: '0.845rem',
    marginTop: 4,
  },
  featArrow: { fontSize: '0.95rem', color: ACCENT },

  /* ── Steps ── */
  stepsSection: {
    background: '#0D0D0D',
  },
  stepsHeader: { marginBottom: 52 },
  stepsGrid: {},
  stepCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '32px 28px',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  stepTop: { display: 'flex', alignItems: 'center', gap: 14 },
  stepNum: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 40, borderRadius: '50%',
    background: ACCENT, color: '#fff',
    fontWeight: 900, fontSize: '0.8rem',
    letterSpacing: '0.04em', flexShrink: 0,
  },
  stepConnector: {
    fontSize: '0.75rem', color: 'rgba(255,255,255,0.12)',
    letterSpacing: '0.05em',
  },
  stepTitle: { fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' },
  stepDesc: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 },

  /* ── 하단 CTA ── */
  bottomCta: {
    background: '#F4F4F2',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bottomCtaInner: { maxWidth: 620, margin: '0 auto', position: 'relative' },
  ctaDecor: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(100px, 16vw, 160px)',
    fontWeight: 900, letterSpacing: '-6px',
    color: 'rgba(0,0,0,0.04)',
    pointerEvents: 'none', userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  ctaTitle: {
    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-2px', lineHeight: 1.15,
    marginBottom: 18, position: 'relative',
  },
  ctaAccent: { color: ACCENT },
  ctaDesc: {
    color: '#8A8A8A', marginBottom: 40,
    fontSize: '15px', lineHeight: 1.8, position: 'relative',
  },
  ctaBtnRow: {
    display: 'flex', gap: 14,
    justifyContent: 'center', flexWrap: 'wrap',
    position: 'relative', /* home-cta-btn-row 클래스가 모바일 override */
  },
  ctaBtnPrimary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '14px 32px', borderRadius: 40,
    background: '#0D0D0D', color: '#fff',
    fontWeight: 700, fontSize: '0.95rem',
    letterSpacing: '-0.2px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  ctaBtnGhost: {
    display: 'inline-flex', alignItems: 'center',
    padding: '14px 32px', borderRadius: 40,
    background: 'transparent',
    border: '1.5px solid rgba(0,0,0,0.15)',
    color: '#0D0D0D', fontWeight: 600, fontSize: '0.95rem',
    letterSpacing: '-0.2px',
  },
}
