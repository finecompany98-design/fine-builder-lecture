import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🏆',
    title: '공모·지원사업 탐색',
    desc: '한국문화예술위원회, 서울문화재단 등 공공기관의 실제 공모전과 지원사업을 한눈에 확인하세요.',
    to: '/competitions',
    cta: '공모 찾아보기 →',
  },
  {
    icon: '✨',
    title: 'AI 맞춤 추천',
    desc: '분야·경력·유형을 선택하면 나에게 맞는 지원사업과 공모전을 AI가 골라드립니다.',
    to: '/ai-recommend',
    cta: 'AI 추천 받기 →',
  },
  {
    icon: '📅',
    title: '마감 D-Day 관리',
    desc: '관심 공모의 마감일을 D-Day 배지로 한눈에 파악하고, 지원 기회를 놓치지 마세요.',
    to: '/competitions',
    cta: '지금 확인하기 →',
  },
]

const STATS = [
  { num: '14+', label: '등록된 공모·지원사업' },
  { num: '8개', label: '지원 예술 분야' },
  { num: '6개', label: '공공기관·재단' },
]

const STEPS = [
  { n: '1', title: '분야 선택', desc: '시각예술, 공연, 문학 등 내 분야를 선택하세요.' },
  { n: '2', title: '공모 탐색', desc: '필터와 검색으로 딱 맞는 공모·지원사업을 찾으세요.' },
  { n: '3', title: '지원 신청', desc: '공식 사이트로 바로 이동해 지원하세요.' },
]

export default function Home() {
  return (
    <main id="main">

      {/* 히어로 */}
      <section style={s.hero} aria-labelledby="hero-title">
        <div style={s.heroInner}>
          <span style={s.heroTag}>문화예술 플랫폼 · fine:D</span>
          <h1 id="hero-title" style={s.heroTitle}>
            예술인의 기회,<br />
            <span style={s.highlight}>한 곳에서 찾으세요</span>
          </h1>
          <p style={s.heroDesc}>
            공공기관·재단의 공모전과 지원사업 정보를 모아,<br />
            AI가 내 분야에 맞게 추천해드립니다.
          </p>
          <div style={s.ctaRow}>
            <Link to="/competitions" style={s.ctaPrimary}>공모·지원사업 찾기</Link>
            <Link to="/ai-recommend" style={s.ctaSecondary}>✨ AI 맞춤 추천</Link>
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section style={s.statsSection} aria-label="서비스 현황">
        <div style={s.statsInner}>
          {STATS.map(({ num, label }) => (
            <div key={label} style={s.statItem}>
              <strong style={s.statNum}>{num}</strong>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 기능 소개 */}
      <section style={s.section} aria-labelledby="features-title">
        <div style={s.sectionInner}>
          <h2 id="features-title" style={s.sectionTitle}>fine:D가 하는 일</h2>
          <p style={s.sectionSub}>복잡한 지원 정보를 쉽고 빠르게</p>
          <div style={s.featureGrid}>
            {FEATURES.map(({ icon, title, desc, to, cta }) => (
              <div key={title} style={s.featureCard}>
                <span style={s.featureIcon} aria-hidden="true">{icon}</span>
                <h3 style={s.featureTitle}>{title}</h3>
                <p style={s.featureDesc}>{desc}</p>
                <Link to={to} style={s.featureLink}>{cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 흐름 */}
      <section style={s.stepsSection} aria-labelledby="steps-title">
        <div style={s.sectionInner}>
          <h2 id="steps-title" style={s.sectionTitle}>이렇게 사용하세요</h2>
          <p style={s.sectionSub}>3단계로 간편하게</p>
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
        <div style={s.sectionInner}>
          <h2 id="cta-title" style={s.ctaTitle}>지금 바로 시작하세요</h2>
          <p style={s.ctaDesc}>내 분야에 맞는 공모와 지원사업을 AI가 추천해드립니다.</p>
          <div style={s.ctaBtnRow}>
            <Link to="/competitions" style={s.ctaBtnWhite}>공모·지원사업 보기</Link>
            <Link to="/ai-recommend" style={s.ctaBtnOutline}>AI 추천 받기</Link>
          </div>
        </div>
      </section>

    </main>
  )
}

const s = {
  /* 히어로 */
  hero: {
    padding: '100px 24px 80px',
    background: 'linear-gradient(160deg, #EDE8FF 0%, #F8F7FF 55%, #FFF9ED 100%)',
    textAlign: 'center',
  },
  heroInner: { maxWidth: 720, margin: '0 auto' },
  heroTag: {
    display: 'inline-block',
    background: '#EDE8FF', color: '#6C3CE1',
    padding: '6px 18px', borderRadius: 20,
    fontSize: '0.82rem', fontWeight: 700,
    border: '1px solid rgba(108,60,225,0.2)',
    marginBottom: 28,
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
    fontWeight: 900, lineHeight: 1.2,
    color: '#1A1027', marginBottom: 20,
  },
  highlight: {
    background: 'linear-gradient(135deg, #6C3CE1, #A855F7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: {
    fontSize: '1.1rem', color: '#6B6585',
    lineHeight: 1.9, marginBottom: 44,
  },
  ctaRow: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimary: {
    padding: '14px 34px', borderRadius: 50,
    background: '#6C3CE1', color: '#fff',
    fontWeight: 700, fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(108,60,225,0.3)',
  },
  ctaSecondary: {
    padding: '14px 34px', borderRadius: 50,
    background: '#fff', color: '#6C3CE1',
    fontWeight: 700, fontSize: '1rem',
    border: '2px solid #6C3CE1',
  },

  /* 통계 */
  statsSection: {
    background: '#fff',
    borderBottom: '1px solid rgba(108,60,225,0.08)',
    padding: '36px 24px',
  },
  statsInner: {
    maxWidth: 800, margin: '0 auto',
    display: 'flex', justifyContent: 'center',
    gap: 64, flexWrap: 'wrap',
  },
  statItem: { textAlign: 'center' },
  statNum: { display: 'block', fontSize: '2.4rem', fontWeight: 900, color: '#6C3CE1' },
  statLabel: { display: 'block', fontSize: '0.85rem', color: '#6B6585', marginTop: 6 },

  /* 공통 섹션 */
  section: { padding: '80px 24px', background: '#F8F7FF' },
  stepsSection: { padding: '80px 24px', background: '#F3F0FF' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionTitle: {
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 900, textAlign: 'center',
    color: '#1A1027', marginBottom: 12,
  },
  sectionSub: { textAlign: 'center', color: '#6B6585', marginBottom: 48, fontSize: '1rem' },

  /* 기능 카드 */
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },
  featureCard: {
    background: '#fff', borderRadius: 20,
    padding: '36px 28px',
    boxShadow: '0 4px 24px rgba(108,60,225,0.08)',
    border: '1px solid rgba(108,60,225,0.08)',
  },
  featureIcon: { fontSize: '2.4rem', display: 'block', marginBottom: 16 },
  featureTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#1A1027', marginBottom: 10 },
  featureDesc: { fontSize: '0.9rem', color: '#6B6585', lineHeight: 1.75, marginBottom: 20 },
  featureLink: { color: '#6C3CE1', fontWeight: 700, fontSize: '0.9rem' },

  /* 단계 */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 24,
  },
  step: {
    background: '#fff', borderRadius: 20,
    padding: '32px 24px', textAlign: 'center',
    boxShadow: '0 2px 16px rgba(108,60,225,0.07)',
  },
  stepNum: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 48, height: 48, borderRadius: '50%',
    background: '#6C3CE1', color: '#fff',
    fontWeight: 900, fontSize: '1.2rem', marginBottom: 18,
  },
  stepTitle: { display: 'block', fontSize: '1.05rem', fontWeight: 800, color: '#1A1027', marginBottom: 10 },
  stepDesc: { fontSize: '0.88rem', color: '#6B6585', lineHeight: 1.75 },

  /* 하단 CTA */
  bottomCta: {
    padding: '80px 24px',
    background: 'linear-gradient(135deg, #6C3CE1 0%, #8B5CF6 100%)',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 900, color: '#fff', marginBottom: 16,
  },
  ctaDesc: { color: 'rgba(255,255,255,0.75)', marginBottom: 36, fontSize: '1rem' },
  ctaBtnRow: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnWhite: {
    padding: '14px 34px', borderRadius: 50,
    background: '#fff', color: '#6C3CE1',
    fontWeight: 700, fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  ctaBtnOutline: {
    padding: '14px 34px', borderRadius: 50,
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: '#fff', fontWeight: 700, fontSize: '1rem',
  },
}
