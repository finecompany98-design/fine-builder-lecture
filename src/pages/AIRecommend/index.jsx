import { useState } from 'react'
import { seedItems } from '../../data/seedData'

const ACCENT = '#3747FF'

/* ── 8개 화면, 5개 named step ── */
const STEPS = [
  {
    id: 'category',
    stepNum: 1, stepTitle: '당신의 목소리',
    question: '어떤 분야에서 활동하시나요?',
    sub: '가장 가까운 분야를 선택해주세요 · 중복 선택 가능',
    multiSelect: true,
    layout: 'grid',
    options: [
      { value: '시각예술',   label: '시각예술',   desc: '회화, 조각, 사진, 설치, 미디어 아트 등' },
      { value: '공연예술',   label: '공연예술',   desc: '음악, 국악, 무용, 연극, 뮤지컬' },
      { value: '문학',       label: '문학·비평',  desc: '시, 소설, 수필, 예술 비평' },
      { value: '영상·미디어',label: '영상·미디어',desc: '영화, 영상, 뉴미디어' },
      { value: '공예·디자인',label: '공예·디자인',desc: '공예, 디자인, 패션' },
      { value: '전 분야',    label: '기타·융복합',desc: '다학제적 연구, 예술 공학 등' },
    ],
  },
  {
    id: 'status',
    stepNum: 2, stepTitle: '창작의 여정',
    question: '현재 신분은 어떻게 되시나요?',
    sub: '지원사업의 자격 요건 필터링에 활용됩니다',
    multiSelect: false,
    layout: 'grid',
    options: [
      { value: '학생',     label: '학생',         desc: '학부·대학원 재학 중' },
      { value: '전업작가', label: '전업 작가',     desc: '예술을 주업으로 활동 중' },
      { value: '겸업작가', label: '겸업 작가',     desc: '다른 직업과 병행 중' },
      { value: '단체',     label: '예술 단체·법인',desc: '팀·단체·기관 자격' },
    ],
  },
  {
    id: 'career',
    stepNum: 2, stepTitle: '창작의 여정',
    question: '이야기의 길이는 얼마나 됐나요?',
    sub: '활동 경력 기간을 선택해주세요',
    multiSelect: false,
    layout: 'grid',
    options: [
      { value: '데뷔전', label: '데뷔 전',      desc: '아직 정식 발표 전' },
      { value: '신진',   label: '3년 미만 · 신진', desc: '막 시작한 새싹 예술인' },
      { value: '유망',   label: '3~10년 · 유망',   desc: '경험을 쌓아가는 중' },
      { value: '중견',   label: '10년 이상 · 중견', desc: '깊이 있는 활동 이력' },
    ],
  },
  {
    id: 'certificate',
    stepNum: 2, stepTitle: '창작의 여정',
    question: '예술활동증명이 있으신가요?',
    sub: '공공기관 지원사업의 필수 조건인 경우가 많습니다',
    multiSelect: false,
    layout: 'row',
    options: [
      { value: 'yes',     label: '있어요',        desc: '예술활동증명 완료' },
      { value: 'no',      label: '아직 없어요',   desc: '미완료 또는 준비 중' },
      { value: 'unknown', label: '잘 모르겠어요', desc: '상관없이 보여주세요' },
    ],
  },
  {
    id: 'region',
    stepNum: 3, stepTitle: '활동의 반경',
    question: '주요 활동 지역은 어디인가요?',
    sub: '지역 재단 사업 매칭에 활용됩니다',
    multiSelect: false,
    layout: 'region',
    options: [
      { value: '서울', label: '서울' },
      { value: '경기', label: '경기·인천' },
      { value: '부산', label: '부산·경남' },
      { value: '대구', label: '대구·경북' },
      { value: '광주', label: '광주·전라' },
      { value: '대전', label: '대전·충청' },
      { value: '강원', label: '강원·제주' },
      { value: '전국', label: '지역 무관' },
    ],
  },
  {
    id: 'purpose',
    stepNum: 4, stepTitle: "지금 가장 필요한 '바탕'",
    question: '어떤 형태의 지원이 필요하신가요?',
    sub: '중복 선택 가능합니다',
    multiSelect: true,
    layout: 'list',
    options: [
      { value: '창작지원', label: '창작 지원', desc: '재료비, 제작비 등 작품 제작 비용' },
      { value: '발표지원', label: '발표 지원', desc: '전시, 공연, 출판 등 세상에 선보이는 비용' },
      { value: '공간지원', label: '공간 지원', desc: '작업실, 연습실, 레지던시 입주' },
      { value: '교류교육', label: '교류·교육', desc: '해외 리서치, 네트워킹, 역량 강화 교육' },
      { value: '복지생활', label: '복지·생활', desc: '창작 준비금, 긴급 생활 지원' },
    ],
  },
  {
    id: 'style',
    stepNum: 5, stepTitle: '작업의 결',
    question: '작업의 성향을 골라주세요',
    sub: '여러 개 선택 가능합니다',
    multiSelect: true,
    layout: 'tags',
    options: [
      { value: '실험적',  label: '#실험적인' },
      { value: '대중적',  label: '#대중적인' },
      { value: '전통적',  label: '#전통적인' },
      { value: '사회참여',label: '#사회참여적' },
      { value: '개인서사',label: '#개인적 서사' },
    ],
  },
  {
    id: 'supportStyle',
    stepNum: 5, stepTitle: '작업의 결',
    question: '선호하는 지원 스타일은?',
    sub: 'fine:D가 추천 우선순위를 정하는 데 활용합니다',
    multiSelect: false,
    layout: 'quote',
    options: [
      { value: '꾸준한', label: '작지만 꾸준하게', desc: '"큰 금액보다 작더라도 꾸준한 지원을 원해요."' },
      { value: '임팩트', label: '한 번에 임팩트',  desc: '"확실한 임팩트를 줄 수 있는 대형 프로젝트를 찾아요."' },
      { value: '자유로운',label: '창작 자유 우선', desc: '"정산이 간단하고 창작의 자유가 보장되는 사업이 좋아요."' },
    ],
  },
]

const NAMED_STEPS = [
  { num: 1, title: '당신의 목소리',      sub: '분야 선택' },
  { num: 2, title: '창작의 여정',        sub: '경력 및 상태' },
  { num: 3, title: '활동의 반경',        sub: '지역' },
  { num: 4, title: "필요한 '바탕'",     sub: '지원 목적' },
  { num: 5, title: '작업의 결',          sub: '감성 질문' },
]

/* ── 필터링 ── */
function filterResults(answers) {
  const cats = answers.category || []
  const isGroup = answers.status === '단체'

  return seedItems.filter(item => {
    if (!item.isActive) return false

    const catMatch =
      cats.length === 0 ||
      item.category === '전 분야' ||
      cats.includes(item.category) ||
      cats.includes('전 분야')

    const targetArr = item.targetGroup || []
    const targetMatch = isGroup
      ? targetArr.includes('단체')
      : targetArr.includes('개인') || targetArr.length === 0

    return catMatch && targetMatch
  })
}

function dday(deadline) {
  if (!deadline) return null
  const now = new Date()
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '마감'
  if (diff === 0) return 'D-DAY'
  return `D-${diff}`
}

/* ── 컴포넌트 ── */
export default function AIRecommend() {
  const [step, setStep]       = useState(-1)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [multiSel, setMultiSel] = useState([])

  function goNext(updatedAnswers) {
    const nextIdx = step + 1
    if (nextIdx >= STEPS.length) {
      setResults(filterResults(updatedAnswers))
      setStep(STEPS.length)
    } else {
      if (STEPS[nextIdx].multiSelect) {
        const saved = updatedAnswers[STEPS[nextIdx].id]
        setMultiSel(Array.isArray(saved) ? saved : [])
      }
      setStep(nextIdx)
    }
  }

  function handleSelect(value) {
    const next = { ...answers, [STEPS[step].id]: value }
    setAnswers(next)
    goNext(next)
  }

  function handleToggle(value) {
    setMultiSel(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleConfirmMulti() {
    const next = { ...answers, [STEPS[step].id]: multiSel }
    setAnswers(next)
    setMultiSel([])
    goNext(next)
  }

  function handleBack() {
    const prevIdx = step - 1
    if (prevIdx < 0) { setStep(-1); return }
    if (STEPS[prevIdx].multiSelect) {
      const saved = answers[STEPS[prevIdx].id]
      setMultiSel(Array.isArray(saved) ? saved : [])
    }
    setStep(prevIdx)
  }

  function restart() {
    setStep(-1)
    setAnswers({})
    setResults(null)
    setMultiSel([])
  }

  /* ── 인트로 ── */
  if (step === -1) {
    return (
      <main id="main" style={s.page}>
        <div style={s.introWrap}>
          <div style={s.introLeft}>
            <p style={s.introEyebrow}>fine:D 맞춤 추천</p>
            <h1 style={s.introTitle}>
              몇 가지 질문으로<br />
              <span style={{ color: ACCENT }}>딱 맞는 공모</span>를<br />
              찾아드립니다
            </h1>
            <p style={s.introDesc}>
              분야·경력·지역·목적을 바탕으로<br />
              fine:D가 직접 골라드립니다
            </p>
            <button onClick={() => setStep(0)} style={s.startBtn}>
              시작하기
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 8 }} aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div style={s.introRight}>
            {NAMED_STEPS.map(({ num, title, sub }) => (
              <div key={num} style={s.introStepRow}>
                <span style={s.introStepNum}>{String(num).padStart(2,'0')}</span>
                <div>
                  <p style={s.introStepTitle}>{title}</p>
                  <p style={s.introStepSub}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  /* ── 결과 ── */
  if (step === STEPS.length) {
    return (
      <main id="main" style={{ ...s.page, alignItems: 'flex-start' }}>
        <div style={{ maxWidth: 960, width: '100%' }}>
          <div style={s.resultHeader}>
            <p style={s.resultEyebrow}>추천 결과</p>
            <h1 style={s.resultTitle}>
              {results.length > 0
                ? <><span style={{ color: ACCENT }}>{results.length}개</span>의 공모·지원사업을 찾았어요</>
                : '조건에 맞는 결과가 없어요'}
            </h1>
            <p style={s.resultSub}>
              {results.length > 0
                ? '선택하신 조건에 맞는 공모·지원사업입니다'
                : '조건을 바꿔서 다시 찾아보세요'}
            </p>
            <button onClick={restart} style={s.retryBtn}>다시 추천받기 →</button>
          </div>

          {results.length === 0 ? (
            <div style={s.emptyBox}>
              <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>✦</p>
              <p style={{ color: '#8A8A8A' }}>다른 조건으로 시도해보세요.</p>
            </div>
          ) : (
            <div style={s.resultGrid}>
              {results.map((item, i) => {
                const ddayLabel = dday(item.deadline)
                const ddayStyle = ddayLabel === '마감'
                  ? { bg: '#F3F4F6', text: '#9CA3AF' }
                  : ddayLabel === 'D-DAY'
                  ? { bg: '#FEE2E2', text: '#EF4444' }
                  : { bg: '#EEF0FF', text: ACCENT }
                return (
                  <a key={i} href={item.orgUrl} target="_blank" rel="noopener noreferrer" style={s.resultCard}>
                    <div style={s.rcTop}>
                      <span style={item.type === '지원사업' ? s.bgGreen : s.bgAmber}>{item.type}</span>
                      <span style={s.bgGray}>{item.category}</span>
                      {ddayLabel && (
                        <span style={{ ...s.ddayBadge, background: ddayStyle.bg, color: ddayStyle.text }}>
                          {ddayLabel}
                        </span>
                      )}
                    </div>
                    <h2 style={s.rcTitle}>{item.title}</h2>
                    <p style={s.rcOrg}>{item.organization}</p>
                    <p style={s.rcAmount}>{item.amount}</p>
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

  /* ── 질문 화면 ── */
  const current = STEPS[step]
  const totalScreens = STEPS.length
  const progress = Math.round(((step + 1) / totalScreens) * 100)
  const isMul = current.multiSelect

  return (
    <main id="main" style={s.page}>
      <div style={s.surveyWrap}>

        {/* 프로그레스 */}
        <div style={s.progressArea}>
          <div style={s.progressTop}>
            <span style={s.stepBadge}>Step {current.stepNum} · {current.stepTitle}</span>
            <span style={s.progressPct}>{progress}%</span>
          </div>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progress}%` }} />
          </div>
          <div style={s.namedStepDots}>
            {NAMED_STEPS.map(ns => (
              <div
                key={ns.num}
                style={{
                  ...s.namedDot,
                  background: ns.num < current.stepNum ? ACCENT
                    : ns.num === current.stepNum ? ACCENT
                    : 'rgba(0,0,0,0.12)',
                  opacity: ns.num === current.stepNum ? 1 : ns.num < current.stepNum ? 0.5 : 0.25,
                }}
              />
            ))}
          </div>
        </div>

        {/* 질문 */}
        <div style={s.questionBox}>
          <h2 style={s.question}>{current.question}</h2>
          <p style={s.questionSub}>{current.sub}</p>
        </div>

        {/* 선택지 */}
        {current.layout === 'grid' && (
          <div style={s.optionGrid}>
            {current.options.map(opt => {
              const sel = isMul ? multiSel.includes(opt.value) : answers[current.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => isMul ? handleToggle(opt.value) : handleSelect(opt.value)}
                  style={{ ...s.optCard, ...(sel ? s.optCardSel : {}) }}
                >
                  {isMul && <span style={{ ...s.checkDot, ...(sel ? s.checkDotSel : {}) }}>
                    {sel ? '✓' : ''}
                  </span>}
                  <span style={s.optLabel}>{opt.label}</span>
                  {opt.desc && <span style={s.optDesc}>{opt.desc}</span>}
                </button>
              )
            })}
          </div>
        )}

        {current.layout === 'row' && (
          <div style={s.optionRow}>
            {current.options.map(opt => {
              const sel = answers[current.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{ ...s.optRowCard, ...(sel ? s.optCardSel : {}) }}
                >
                  <span style={s.optLabel}>{opt.label}</span>
                  {opt.desc && <span style={s.optDesc}>{opt.desc}</span>}
                </button>
              )
            })}
          </div>
        )}

        {current.layout === 'region' && (
          <div style={s.regionGrid}>
            {current.options.map(opt => {
              const sel = answers[current.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{ ...s.regionBtn, ...(sel ? s.optCardSel : {}) }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {current.layout === 'list' && (
          <div style={s.optionList}>
            {current.options.map(opt => {
              const sel = isMul ? multiSel.includes(opt.value) : answers[current.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => isMul ? handleToggle(opt.value) : handleSelect(opt.value)}
                  style={{ ...s.optListRow, ...(sel ? s.optListRowSel : {}) }}
                >
                  <div>
                    <span style={{ ...s.optLabel, display: 'block' }}>{opt.label}</span>
                    {opt.desc && <span style={s.optDesc}>{opt.desc}</span>}
                  </div>
                  <span style={{ ...s.checkCircle, ...(sel ? s.checkCircleSel : {}) }}>
                    {sel ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {current.layout === 'tags' && (
          <div style={s.tagWrap}>
            {current.options.map(opt => {
              const sel = multiSel.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => handleToggle(opt.value)}
                  style={{ ...s.tagBtn, ...(sel ? s.tagBtnSel : {}) }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {current.layout === 'quote' && (
          <div style={s.optionList}>
            {current.options.map(opt => {
              const sel = answers[current.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{ ...s.quoteCard, ...(sel ? s.quoteCardSel : {}) }}
                >
                  <span style={{ ...s.optLabel, display: 'block', marginBottom: 6 }}>{opt.label}</span>
                  <span style={s.quoteText}>{opt.desc}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* 멀티셀렉트 확인 버튼 */}
        {isMul && (
          <button
            onClick={handleConfirmMulti}
            style={{ ...s.confirmBtn, opacity: multiSel.length === 0 ? 0.45 : 1 }}
          >
            {multiSel.length === 0 ? '건너뛰기' : `${multiSel.length}개 선택 · 계속하기 →`}
          </button>
        )}

        {/* 이전 버튼 */}
        {step > 0 && (
          <button onClick={handleBack} style={s.backBtn}>← 이전으로</button>
        )}
      </div>
    </main>
  )
}

/* ── 스타일 ── */
const s = {
  page: {
    minHeight: '88vh',
    background: '#FAFAF9',
    padding: '64px 24px 96px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 인트로 */
  introWrap: {
    maxWidth: 900, width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 60, alignItems: 'center',
  },
  introLeft: { display: 'flex', flexDirection: 'column', gap: 0 },
  introEyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20,
  },
  introTitle: {
    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1.5px', lineHeight: 1.2, marginBottom: 18,
  },
  introDesc: {
    fontSize: '14px', color: '#8A8A8A', lineHeight: 1.9, marginBottom: 36,
  },
  startBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 28px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.9rem',
    fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(55,71,255,0.3)',
    letterSpacing: '-0.2px', alignSelf: 'flex-start',
  },
  introRight: {
    display: 'flex', flexDirection: 'column', gap: 0,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  introStepRow: {
    display: 'flex', alignItems: 'center', gap: 18,
    padding: '18px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  introStepNum: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.04em', flexShrink: 0, width: 24,
  },
  introStepTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#0D0D0D', marginBottom: 2 },
  introStepSub: { fontSize: '12px', color: '#9A9A9A' },

  /* 설문 */
  surveyWrap: { maxWidth: 640, width: '100%' },

  progressArea: { marginBottom: 44 },
  progressTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  stepBadge: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  progressPct: { fontSize: '12px', fontWeight: 700, color: '#0D0D0D' },
  progressTrack: {
    height: 3, borderRadius: 3,
    background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 12,
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    background: ACCENT,
    transition: 'width 0.4s ease',
  },
  namedStepDots: { display: 'flex', gap: 6 },
  namedDot: {
    width: 24, height: 3, borderRadius: 3,
    transition: 'all 0.3s',
  },

  questionBox: { marginBottom: 32 },
  question: {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.3,
  },
  questionSub: { color: '#8A8A8A', fontSize: '13px' },

  /* 옵션: grid (2열) */
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10, marginBottom: 20,
  },
  optCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    padding: '18px 18px', borderRadius: 14,
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.1)',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', transition: 'all 0.15s',
    position: 'relative', gap: 4,
  },
  optCardSel: {
    border: `1.5px solid ${ACCENT}`,
    background: 'rgba(55,71,255,0.04)',
  },
  checkDot: {
    position: 'absolute', top: 12, right: 12,
    width: 20, height: 20, borderRadius: '50%',
    border: '1.5px solid rgba(0,0,0,0.15)',
    fontSize: '11px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: 'transparent', flexShrink: 0,
    transition: 'all 0.15s',
  },
  checkDotSel: {
    background: ACCENT, borderColor: ACCENT,
    color: '#fff',
  },

  /* 옵션: row (3열) */
  optionRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10, marginBottom: 20,
  },
  optRowCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '18px 12px', borderRadius: 14,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)',
    cursor: 'pointer', textAlign: 'center',
    fontFamily: 'inherit', transition: 'all 0.15s', gap: 4,
  },

  /* 옵션: region (4열) */
  regionGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8, marginBottom: 20,
  },
  regionBtn: {
    padding: '13px 8px', borderRadius: 10,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)',
    cursor: 'pointer', fontFamily: 'inherit',
    fontSize: '0.875rem', fontWeight: 600, color: '#0D0D0D',
    transition: 'all 0.15s',
  },

  /* 옵션: list */
  optionList: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  optListRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 18px', borderRadius: 14,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    transition: 'all 0.15s',
  },
  optListRowSel: {
    border: `1.5px solid ${ACCENT}`,
    background: 'rgba(55,71,255,0.04)',
  },
  checkCircle: {
    width: 22, height: 22, borderRadius: '50%',
    border: '1.5px solid rgba(0,0,0,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', color: 'transparent', flexShrink: 0,
    transition: 'all 0.15s',
  },
  checkCircleSel: {
    background: ACCENT, borderColor: ACCENT, color: '#fff',
  },

  /* 옵션: tags */
  tagWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20,
  },
  tagBtn: {
    padding: '10px 20px', borderRadius: 40,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
    cursor: 'pointer', fontFamily: 'inherit',
    fontSize: '0.9rem', fontWeight: 600, color: '#4A4A4A',
    transition: 'all 0.15s',
  },
  tagBtnSel: {
    background: ACCENT, borderColor: ACCENT,
    color: '#fff',
  },

  /* 옵션: quote */
  quoteCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    padding: '18px 20px', borderRadius: 14,
    background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', transition: 'all 0.15s',
  },
  quoteCardSel: {
    border: `1.5px solid ${ACCENT}`,
    background: 'rgba(55,71,255,0.04)',
  },
  quoteText: {
    fontSize: '13px', color: '#8A8A8A', lineHeight: 1.7,
    fontStyle: 'italic',
  },

  /* 공통 레이블 */
  optLabel: { fontSize: '0.9rem', fontWeight: 700, color: '#0D0D0D' },
  optDesc: { fontSize: '12px', color: '#8A8A8A', lineHeight: 1.6 },

  /* 버튼 */
  confirmBtn: {
    width: '100%', padding: '14px',
    background: ACCENT, color: '#fff',
    borderRadius: 14, fontWeight: 700, fontSize: '0.9rem',
    fontFamily: 'inherit', cursor: 'pointer',
    marginBottom: 12, letterSpacing: '-0.2px',
    transition: 'opacity 0.15s',
  },
  backBtn: {
    color: '#9A9A9A', fontSize: '0.85rem',
    fontFamily: 'inherit', padding: '8px 0',
    cursor: 'pointer', display: 'block', marginTop: 4,
  },

  /* 결과 */
  resultHeader: { marginBottom: 40 },
  resultEyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
  },
  resultTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', marginBottom: 10,
  },
  resultSub: { color: '#8A8A8A', marginBottom: 20, fontSize: '14px' },
  retryBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '9px 20px', borderRadius: 40,
    background: '#fff', color: '#0D0D0D',
    border: '1.5px solid rgba(0,0,0,0.12)',
    fontWeight: 700, fontSize: '0.875rem',
    fontFamily: 'inherit', cursor: 'pointer',
  },
  emptyBox: { textAlign: 'center', padding: '80px 0' },

  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  resultCard: {
    display: 'block', background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 18, padding: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  rcTop: { display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' },
  bgGreen: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
    background: '#D1FAE5', color: '#059669',
  },
  bgAmber: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
    background: '#FEF3C7', color: '#D97706',
  },
  bgGray: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
    background: '#ECECEA', color: '#5A5A5A',
  },
  ddayBadge: {
    marginLeft: 'auto', padding: '3px 10px',
    borderRadius: 20, fontSize: '0.75rem', fontWeight: 900,
  },
  rcTitle: { fontSize: '0.95rem', fontWeight: 800, color: '#0D0D0D', marginBottom: 6, lineHeight: 1.4 },
  rcOrg: { color: '#5A5A5A', fontSize: '0.82rem', marginBottom: 4, fontWeight: 600 },
  rcAmount: { color: ACCENT, fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 },
  rcDesc: { color: '#8A8A8A', fontSize: '0.82rem', lineHeight: 1.75, marginBottom: 14 },
  rcLink: { color: '#0D0D0D', fontSize: '0.82rem', fontWeight: 700 },
}
