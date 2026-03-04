import { useState } from 'react'
import { seedItems } from '../../data/seedData'

const STEPS = [
  {
    id: 'category',
    question: '어떤 분야에서 활동하시나요?',
    sub: '가장 가까운 분야를 선택해주세요.',
    options: [
      { value: '전 분야', label: '전 분야', emoji: '🎨' },
      { value: '시각예술', label: '시각예술', emoji: '🖼️' },
      { value: '공연예술', label: '공연예술', emoji: '🎭' },
      { value: '문학', label: '문학·출판', emoji: '📝' },
      { value: '음악', label: '음악', emoji: '🎵' },
      { value: '무용', label: '무용', emoji: '💃' },
      { value: '영상·미디어', label: '영상·미디어', emoji: '🎬' },
      { value: '공예·디자인', label: '공예·디자인', emoji: '✏️' },
    ],
  },
  {
    id: 'target',
    question: '현재 활동 상태는 어떻게 되시나요?',
    sub: '지원 조건 필터링에 활용됩니다.',
    options: [
      { value: '개인', label: '개인 예술가', emoji: '👤', desc: '개인 자격으로 지원' },
      { value: '단체', label: '단체·기관', emoji: '👥', desc: '팀·단체 자격으로 지원' },
      { value: '모두', label: '상관없음', emoji: '✅', desc: '개인·단체 모두 보기' },
    ],
  },
  {
    id: 'type',
    question: '어떤 유형을 찾고 계신가요?',
    sub: '공모전은 수상·입선, 지원사업은 창작비 지원입니다.',
    options: [
      { value: '공모전', label: '공모전', emoji: '🏆', desc: '수상 및 입선 기회' },
      { value: '지원사업', label: '지원사업', emoji: '🌱', desc: '창작 활동비 직접 지원' },
      { value: '모두', label: '모두 보기', emoji: '📋', desc: '유형 구분 없이 전체' },
    ],
  },
]

function dday(deadline) {
  if (!deadline) return null
  const now = new Date()
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '마감'
  if (diff === 0) return 'D-DAY'
  return `D-${diff}`
}

function filterResults(answers) {
  return seedItems.filter(item => {
    const catMatch =
      answers.category === '전 분야' ||
      item.category === answers.category ||
      item.category === '전 분야'
    const targetMatch =
      answers.target === '모두' ||
      (item.targetGroup || []).includes(answers.target)
    const typeMatch =
      answers.type === '모두' ||
      item.type === answers.type
    return catMatch && targetMatch && typeMatch
  })
}

export default function AIRecommend() {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)

  function handleSelect(value) {
    const key = STEPS[step].id
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setResults(filterResults(next))
      setStep(STEPS.length)
    }
  }

  function restart() {
    setStep(-1)
    setAnswers({})
    setResults(null)
  }

  const progress = step < 0 ? 0 : Math.round(((step + 1) / STEPS.length) * 100)

  /* ── 인트로 ── */
  if (step === -1) {
    return (
      <main id="main" style={s.page}>
        <div style={s.introCard}>
          <span style={s.introEmoji}>✨</span>
          <h1 style={s.introTitle}>AI 맞춤 추천</h1>
          <p style={s.introDesc}>
            3가지 질문에 답하면<br />나에게 맞는 공모·지원사업을 추려드립니다.
          </p>
          <div style={s.introList}>
            {STEPS.map((st, i) => (
              <div key={st.id} style={s.introStep}>
                <span style={s.introStepNum}>{i + 1}</span>
                <span style={s.introStepLabel}>{st.question}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(0)} style={s.startBtn}>시작하기 →</button>
        </div>
      </main>
    )
  }

  /* ── 결과 ── */
  if (step === STEPS.length) {
    return (
      <main id="main" style={{ ...s.page, alignItems: 'flex-start' }}>
        <div style={{ maxWidth: 900, width: '100%' }}>
          <div style={s.resultHeader}>
            <h1 style={s.resultTitle}>
              {results.length > 0 ? `추천 결과 ${results.length}건` : '해당 결과가 없습니다'}
            </h1>
            <p style={s.resultSub}>
              {results.length > 0
                ? '선택하신 조건에 맞는 공모·지원사업입니다.'
                : '조건을 바꿔서 다시 찾아보세요.'}
            </p>
            <button onClick={restart} style={s.retryBtn}>🔄 다시 추천받기</button>
          </div>

          {results.length === 0 ? (
            <div style={s.emptyBox}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🔎</span>
              <p style={{ color: '#888888' }}>다른 조건으로 시도해보세요.</p>
            </div>
          ) : (
            <div style={s.resultGrid}>
              {results.map((item, i) => {
                const ddayLabel = dday(item.deadline)
                const ddayStyle = ddayLabel === '마감'
                  ? { bg: '#F3F4F6', text: '#9CA3AF' }
                  : ddayLabel === 'D-DAY'
                  ? { bg: '#FEE2E2', text: '#EF4444' }
                  : { bg: '#EBEBEB', text: '#111111' }
                return (
                  <a key={i} href={item.orgUrl} target="_blank" rel="noopener noreferrer" style={s.resultCard}>
                    <div style={s.rcTop}>
                      <span style={item.type === '지원사업' ? s.bgGreen : s.bgAmber}>{item.type}</span>
                      <span style={s.bgPurple}>{item.category}</span>
                      {ddayLabel && (
                        <span style={{ ...s.ddayBadge, background: ddayStyle.bg, color: ddayStyle.text }}>
                          {ddayLabel}
                        </span>
                      )}
                    </div>
                    <h2 style={s.rcTitle}>{item.title}</h2>
                    <p style={s.rcOrg}>📌 {item.organization}</p>
                    <p style={s.rcAmount}>💰 {item.amount}</p>
                    <p style={s.rcDesc}>{item.description}</p>
                    <span style={s.rcLink}>공식 사이트에서 확인 →</span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </main>
    )
  }

  /* ── 질문 ── */
  const current = STEPS[step]

  return (
    <main id="main" style={s.page}>
      <div style={s.surveyWrap}>

        {/* 프로그레스 */}
        <div style={s.progressArea}>
          <div style={s.progressMeta}>
            <span style={s.stepLabel}>{step + 1} / {STEPS.length}</span>
            <span style={s.progressPct}>{progress}%</span>
          </div>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* 질문 */}
        <div style={s.questionBox}>
          <h2 style={s.question}>{current.question}</h2>
          <p style={s.questionSub}>{current.sub}</p>
        </div>

        {/* 선택지 */}
        <div style={current.options.length > 4 ? s.optionGrid : s.optionCol}>
          {current.options.map(opt => (
            <button key={opt.value} onClick={() => handleSelect(opt.value)} style={s.optionBtn}>
              <span style={s.optionEmoji} aria-hidden="true">{opt.emoji}</span>
              <span style={s.optionLabel}>{opt.label}</span>
              {opt.desc && <span style={s.optionDesc}>{opt.desc}</span>}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={s.backBtn}>← 이전으로</button>
        )}
      </div>
    </main>
  )
}

const s = {
  page: {
    minHeight: '80vh', background: '#F8F8F8',
    padding: '60px 24px 80px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  introCard: {
    background: '#fff', borderRadius: 24,
    padding: '48px 40px', maxWidth: 480, width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  introEmoji: { fontSize: '3rem', display: 'block', marginBottom: 16 },
  introTitle: { fontSize: '1.8rem', fontWeight: 900, color: '#111111', marginBottom: 12 },
  introDesc: { color: '#888888', lineHeight: 1.8, marginBottom: 32, fontSize: '1rem' },
  introList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36, textAlign: 'left' },
  introStep: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px', borderRadius: 12,
    background: '#F8F8F8', border: '1px solid rgba(0,0,0,0.08)',
  },
  introStepNum: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: '50%',
    background: '#111111', color: '#fff',
    fontSize: '0.85rem', fontWeight: 900, flexShrink: 0,
  },
  introStepLabel: { color: '#111111', fontSize: '0.9rem', fontWeight: 600 },
  startBtn: {
    width: '100%', padding: '14px',
    background: '#111111', color: '#fff',
    borderRadius: 14, fontWeight: 700, fontSize: '1rem',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },

  surveyWrap: { maxWidth: 600, width: '100%' },
  progressArea: { marginBottom: 40 },
  progressMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  stepLabel: { fontSize: '0.85rem', color: '#888888', fontWeight: 600 },
  progressPct: { fontSize: '0.85rem', color: '#111111', fontWeight: 700 },
  progressBar: {
    height: 6, borderRadius: 6,
    background: 'rgba(0,0,0,0.12)', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 6,
    background: 'linear-gradient(90deg, #111111, #555555',
    transition: 'width 0.4s ease',
  },

  questionBox: { marginBottom: 28 },
  question: { fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 900, color: '#111111', marginBottom: 8 },
  questionSub: { color: '#888888', fontSize: '0.95rem' },

  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 12, marginBottom: 24,
  },
  optionCol: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  optionBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 16px', borderRadius: 16,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)',
    cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: 'inherit', textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  optionEmoji: { fontSize: '1.8rem', display: 'block', marginBottom: 8 },
  optionLabel: { fontWeight: 700, color: '#111111', fontSize: '0.95rem', marginBottom: 4 },
  optionDesc: { fontSize: '0.78rem', color: '#888888' },
  backBtn: {
    color: '#888888', fontSize: '0.9rem',
    fontFamily: 'inherit', padding: '8px 0', cursor: 'pointer',
  },

  resultHeader: { textAlign: 'center', marginBottom: 36 },
  resultTitle: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#111111', marginBottom: 10 },
  resultSub: { color: '#888888', marginBottom: 20 },
  retryBtn: {
    padding: '10px 24px', borderRadius: 20,
    background: '#EBEBEB', color: '#111111',
    border: '1px solid rgba(0,0,0,0.3)',
    fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit', cursor: 'pointer',
  },
  emptyBox: { textAlign: 'center', padding: '80px 0' },

  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  resultCard: {
    display: 'block', background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: 20, padding: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    textDecoration: 'none',
  },
  rcTop: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' },
  bgGreen: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0',
  },
  bgAmber: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
  },
  bgPurple: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#EBEBEB', color: '#111111', border: '1px solid #DDDDDD',
  },
  ddayBadge: {
    marginLeft: 'auto', padding: '3px 10px',
    borderRadius: 20, fontSize: '0.8rem', fontWeight: 900,
  },
  rcTitle: { fontSize: '1rem', fontWeight: 800, color: '#111111', marginBottom: 6, lineHeight: 1.4 },
  rcOrg: { color: '#111111', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 },
  rcAmount: { color: '#D97706', fontWeight: 700, fontSize: '0.88rem', marginBottom: 10 },
  rcDesc: { color: '#888888', fontSize: '0.84rem', lineHeight: 1.7, marginBottom: 14 },
  rcLink: { color: '#111111', fontSize: '0.85rem', fontWeight: 700 },
}
