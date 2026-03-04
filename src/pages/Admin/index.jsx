import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

const CATEGORIES = ['전 분야', '시각예술', '공연예술', '문학', '음악', '무용', '영상·미디어', '공예·디자인']
const FIELD_OPTIONS = {
  '시각예술':    ['회화', '조각', '설치', '사진', '판화', '미디어아트', '공예', '기타'],
  '공연예술':    ['연극', '뮤지컬', '무용', '음악', '오페라', '서커스', '기타'],
  '문학':        ['시', '소설', '희곡', '에세이', '평론', '번역', '기타'],
  '음악':        ['클래식', '국악', '재즈', '팝/인디', '전자음악', '기타'],
  '무용':        ['현대무용', '발레', '한국무용', '비보이', '기타'],
  '영상·미디어': ['독립영화', '단편영화', '다큐멘터리', '웹툰', 'VR/XR', '애니메이션', '기타'],
  '공예·디자인': ['도예', '금속공예', '목공예', '그래픽디자인', '패션', '기타'],
  '전 분야':     ['해당 없음 (전 분야)'],
}
const REGIONS = ['전국', '서울', '경기', '부산', '인천', '대구', '광주', '대전', '울산', '강원', '충청', '전라', '경상', '제주']

const empty = {
  title: '', organization: '', orgUrl: '',
  category: '전 분야', type: '지원사업',
  fields: [], targetGroup: [],
  amount: '', region: '전국',
  deadline: '', description: '',
}

export default function Admin() {
  const { user, loading, isAdmin } = useAuth()
  const [form, setForm] = useState(empty)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <Spinner />
  if (!user) return <NotLoggedIn />
  if (!isAdmin) return <NotAdmin />

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleArr = (key, val) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.organization || !form.deadline) {
      setError('제목, 주관기관, 마감일은 필수입니다.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'competitions'), {
        ...form,
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        isActive: true,
        createdAt: Timestamp.now(),
        source: 'admin',
      })
      setDone(true)
      setForm(empty)
    } catch (e) {
      setError('저장 실패: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldOptions = FIELD_OPTIONS[form.category] || []

  return (
    <main style={s.main}>
      <div style={s.inner}>
        <div style={s.header}>
          <Link to="/competitions" style={s.back}>← 목록으로</Link>
          <h1 style={s.title}>📋 공모·지원사업 등록</h1>
          <p style={s.sub}>관리자 전용 — 새 공모전·지원사업 정보를 직접 등록합니다.</p>
        </div>

        {done && (
          <div style={s.success}>
            ✅ 등록 완료!{' '}
            <button style={s.linkBtn} onClick={() => setDone(false)}>계속 등록하기</button>{' '}|{' '}
            <Link to="/competitions" style={s.linkA}>목록 보기</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>

          {/* ── 기본 정보 ── */}
          <Section title="기본 정보">
            <Field label="공모·지원사업명 *">
              <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="예: 2026 창작산실 올해의 신작" />
            </Field>
            <Row>
              <Field label="주관기관 *">
                <input style={s.input} value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="예: 한국문화예술위원회" />
              </Field>
              <Field label="기관 공식 URL">
                <input style={s.input} value={form.orgUrl} onChange={e => set('orgUrl', e.target.value)} placeholder="https://www.arko.or.kr" />
              </Field>
            </Row>
          </Section>

          {/* ── 분야 & 유형 ── */}
          <Section title="분야 & 유형">
            <Row>
              <Field label="카테고리">
                <select style={s.select} value={form.category} onChange={e => { set('category', e.target.value); set('fields', []) }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="유형">
                <select style={s.select} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>지원사업</option>
                  <option>공모전</option>
                </select>
              </Field>
            </Row>
            <Field label="세부 분야 (해당 항목 모두 선택)">
              <div style={s.checkGrid}>
                {fieldOptions.map(f => (
                  <label key={f} style={s.checkLabel}>
                    <input type="checkbox" checked={form.fields.includes(f)} onChange={() => toggleArr('fields', f)} style={s.checkbox} />
                    {f}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="지원 대상">
              <div style={s.checkGrid}>
                {['개인', '단체', '법인', '청년(만 39세 이하)', '신진 예술가', '경력 예술가'].map(t => (
                  <label key={t} style={s.checkLabel}>
                    <input type="checkbox" checked={form.targetGroup.includes(t)} onChange={() => toggleArr('targetGroup', t)} style={s.checkbox} />
                    {t}
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          {/* ── 지원 규모 & 일정 ── */}
          <Section title="지원 규모 & 일정">
            <Row>
              <Field label="지원 규모 / 상금">
                <input style={s.input} value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="예: 최대 5,000만원 / 대상 1,000만원" />
              </Field>
              <Field label="지역">
                <select style={s.select} value={form.region} onChange={e => set('region', e.target.value)}>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
            </Row>
            <Field label="접수 마감일 *">
              <input style={s.input} type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </Field>
          </Section>

          {/* ── 설명 ── */}
          <Section title="상세 설명">
            <Field label="사업 설명">
              <textarea
                style={{ ...s.input, height: 120, resize: 'vertical' }}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="지원 목적, 내용, 신청 방법 등을 간략히 입력해주세요"
              />
            </Field>
          </Section>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" disabled={submitting} style={s.submitBtn}>
            {submitting ? '등록 중...' : '✅ 등록하기'}
          </button>
        </form>
      </div>
    </main>
  )
}

/* ── 서브 컴포넌트 ── */
function Section({ title, children }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}
function Field({ label, children }) {
  return <div style={s.field}><label style={s.label}>{label}</label>{children}</div>
}
function Row({ children }) {
  return <div style={s.row}>{children}</div>
}
function Spinner() {
  return <div style={{ color: '#AAAAAA', padding: 80, textAlign: 'center' }}>확인 중...</div>
}
function NotLoggedIn() {
  return (
    <div style={{ padding: 80, textAlign: 'center' }}>
      <p style={{ color: '#fff', fontSize: '1.2rem' }}>로그인이 필요합니다.</p>
      <Link to="/auth" style={{ color: '#555555', marginTop: 16, display: 'inline-block' }}>로그인하러 가기 →</Link>
    </div>
  )
}
function NotAdmin() {
  return <div style={{ padding: 80, textAlign: 'center', color: '#F87171' }}>관리자만 접근할 수 있습니다.</div>
}

/* ── 스타일 ── */
const s = {
  main: { padding: '60px 24px 80px', minHeight: '80vh' },
  inner: { maxWidth: 780, margin: '0 auto' },
  header: { marginBottom: 40 },
  back: { color: '#555555', fontSize: '0.9rem', display: 'inline-block', marginBottom: 16 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: 8 },
  sub: { color: 'rgba(240,235,248,0.55)', fontSize: '0.9rem' },
  success: {
    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(74,222,128,0.3)',
    color: '#4ADE80', borderRadius: 12, padding: '16px 20px', marginBottom: 24,
    fontSize: '0.95rem',
  },
  linkBtn: { background: 'none', border: 'none', color: '#4ADE80', fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' },
  linkA: { color: '#4ADE80' },
  form: { display: 'flex', flexDirection: 'column', gap: 32 },
  section: {
    background: 'rgba(26,16,48,0.85)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '28px 28px 24px',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 800, color: '#AAAAAA', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' },
  field: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  label: { fontSize: '0.85rem', fontWeight: 700, color: 'rgba(240,235,248,0.65)' },
  input: {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: '#fff',
    fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
  },
  select: {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: '#fff',
    fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  checkGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(240,235,248,0.75)', fontSize: '0.88rem', cursor: 'pointer' },
  checkbox: { accentColor: '#555555', width: 16, height: 16 },
  error: { color: '#F87171', fontSize: '0.9rem', padding: '12px 16px', background: 'rgba(248,113,113,0.1)', borderRadius: 10 },
  submitBtn: {
    padding: '16px', borderRadius: 14,
    background: 'linear-gradient(135deg,#111111,#555555)',
    color: '#fff', fontSize: '1.05rem', fontWeight: 800,
    fontFamily: 'inherit', cursor: 'pointer', border: 'none',
    transition: 'opacity 0.2s',
  },
}
