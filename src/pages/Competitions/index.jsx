import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'

const ACCENT = '#3747FF'

const CATEGORIES = ['전체', '전 분야', '시각예술', '공연예술', '문학', '음악', '무용', '영상·미디어', '공예·디자인']
const TYPES = ['전체', '지원사업', '공모전']

function dday(deadline) {
  if (!deadline) return null
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: '마감', type: 'closed' }
  if (diff === 0) return { label: 'D-DAY', type: 'today' }
  if (diff <= 7) return { label: `D-${diff}`, type: 'urgent' }
  return { label: `D-${diff}`, type: 'normal' }
}

const DDAY_STYLE = {
  closed: { background: '#F3F4F6', color: '#9CA3AF' },
  today:  { background: '#FEE2E2', color: '#EF4444' },
  urgent: { background: '#FEF3C7', color: '#D97706' },
  normal: { background: '#EEF0FF', color: ACCENT },
}

export default function Competitions() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '전체')
  const [activeType, setActiveType] = useState(searchParams.get('type') || '전체')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'competitions'))
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // 클라이언트에서 필터 + 마감일 정렬 (복합 인덱스 불필요)
        const active = all
          .filter(it => it.isActive !== false)
          .sort((a, b) => {
            const da = a.deadline?.toDate ? a.deadline.toDate() : new Date(a.deadline || 0)
            const db_ = b.deadline?.toDate ? b.deadline.toDate() : new Date(b.deadline || 0)
            return da - db_
          })
        setItems(active)
      } catch (e) {
        console.error('competitions fetch error:', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = items.filter(item => {
    if (activeCategory !== '전체' && item.category !== activeCategory) return false
    if (activeType !== '전체' && item.type !== activeType) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        item.title?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        (item.fields || []).some(f => f.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <main id="main" style={s.main}>
      <div style={s.inner}>

        {/* ── 페이지 헤더 ── */}
        <div style={s.pageHeader}>
          <div style={s.headerLeft}>
            <span style={s.eyebrow}>◎ FINE:D CURATED</span>
            <h1 style={s.title}>공모·지원사업</h1>
            <p style={s.subtitle}>
              공공기관·재단의 실제 공모전과 지원사업 정보를 한데 모았습니다
            </p>
          </div>
          {!loading && (
            <div style={s.totalBadge}>
              <span style={s.totalNum}>{filtered.length}</span>
              <span style={s.totalLabel}>건</span>
            </div>
          )}
        </div>

        {/* ── 검색 + 필터 ── */}
        <div style={s.controlBar}>
          {/* 검색 */}
          <div style={s.searchWrap} role="search">
            <svg style={s.searchIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="#AAAAAA" strokeWidth="1.8"/>
              <path d="M14 14l3 3" stroke="#AAAAAA" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              id="comp-search"
              type="search"
              placeholder="공모명, 기관명, 분야로 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>

          {/* 필터 */}
          <div style={s.filterBar}>
            <div style={s.filterGroup}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    ...s.chip,
                    ...(activeCategory === cat ? s.chipActive : {}),
                  }}
                >{cat}</button>
              ))}
            </div>
            <div style={s.filterDivider} />
            <div style={s.filterGroup}>
              {TYPES.map(tp => (
                <button
                  key={tp}
                  onClick={() => setActiveType(tp)}
                  style={{
                    ...s.chip,
                    ...(activeType === tp ? s.chipTypeActive : {}),
                  }}
                >{tp}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 목록 ── */}
        {loading ? (
          <div style={s.stateBox}>
            <div style={s.spinner} />
            <p style={s.stateText}>불러오는 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.stateBox}>
            <svg style={s.stateIco} viewBox="0 0 48 48" fill="none">
              <circle cx="22" cy="22" r="14" stroke="#DDDDDD" strokeWidth="2.5"/>
              <path d="M32 32l8 8" stroke="#DDDDDD" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <p style={s.stateText}>해당하는 공모·지원사업이 없습니다</p>
            <button
              onClick={() => { setActiveCategory('전체'); setActiveType('전체'); setSearch('') }}
              style={s.resetBtn}
            >필터 초기화</button>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map(item => {
              const dd = dday(item.deadline)
              return (
                <a
                  key={item.id}
                  href={item.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.card}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* 상단 배지 줄 */}
                  <div style={s.cardTop}>
                    <span style={item.type === '지원사업' ? s.typeGreen : s.typeAmber}>
                      {item.type}
                    </span>
                    <span style={s.catBadge}>{item.category}</span>
                    {dd && (
                      <span style={{ ...s.ddayBadge, ...DDAY_STYLE[dd.type] }}>
                        {dd.label}
                      </span>
                    )}
                  </div>

                  {/* 제목 + 기관 */}
                  <h2 style={s.cardTitle}>{item.title}</h2>
                  <p style={s.cardOrg}>{item.organization}</p>

                  {/* 분야 태그 */}
                  {(item.fields || []).length > 0 && (
                    <div style={s.tagRow}>
                      {(item.fields || []).slice(0, 4).map(f => (
                        <span key={f} style={s.tag}>{f}</span>
                      ))}
                    </div>
                  )}

                  {/* 메타: 지원금 + 마감 */}
                  <div style={s.cardMeta}>
                    {item.amount && (
                      <span style={s.amount}>{item.amount}</span>
                    )}
                    <span style={s.deadline}>
                      마감{' '}
                      {item.deadline?.toDate
                        ? item.deadline.toDate().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                        : '미정'}
                    </span>
                  </div>

                  {/* 설명 */}
                  {item.description && (
                    <p style={s.desc}>{item.description}</p>
                  )}

                  <span style={s.link}>공식 사이트 바로가기 →</span>
                </a>
              )
            })}
          </div>
        )}

      </div>
    </main>
  )
}

const s = {
  main: {
    padding: '80px 0 100px',
    background: '#F7F7F6',
    minHeight: '80vh',
  },
  inner: {
    maxWidth: 1140,
    width: '90%',
    margin: '0 auto',
  },

  /* 헤더 */
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 36,
    gap: 20,
    flexWrap: 'wrap',
  },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: 8 },
  eyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1.5px', lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '0.9rem', color: '#888888', lineHeight: 1.7,
  },
  totalBadge: {
    display: 'flex', alignItems: 'baseline', gap: 3,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 12, padding: '10px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    flexShrink: 0,
  },
  totalNum: {
    fontSize: '1.8rem', fontWeight: 900, color: ACCENT, letterSpacing: '-1px',
  },
  totalLabel: {
    fontSize: '0.85rem', fontWeight: 600, color: '#888888',
  },

  /* 컨트롤 바 */
  controlBar: {
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  searchWrap: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute', left: 16, top: '50%',
    transform: 'translateY(-50%)',
    width: 18, height: 18,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '13px 20px 13px 46px',
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: 12,
    color: '#0D0D0D', fontSize: '0.95rem',
    fontFamily: 'inherit', outline: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  filterBar: {
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  filterGroup: {
    display: 'flex', flexWrap: 'wrap', gap: 6,
  },
  filterDivider: {
    height: 1,
    background: 'rgba(0,0,0,0.07)',
    margin: '2px 0',
  },
  chip: {
    padding: '5px 14px',
    borderRadius: 20,
    fontSize: '0.82rem',
    fontWeight: 500,
    background: 'transparent',
    color: '#666666',
    border: '1px solid rgba(0,0,0,0.14)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.12s',
  },
  chipActive: {
    background: '#0D0D0D',
    color: '#fff',
    border: '1px solid #0D0D0D',
    fontWeight: 700,
  },
  chipTypeActive: {
    background: ACCENT,
    color: '#fff',
    border: `1px solid ${ACCENT}`,
    fontWeight: 700,
  },

  /* 상태 박스 */
  stateBox: {
    textAlign: 'center',
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid rgba(55,71,255,0.15)',
    borderTop: `3px solid ${ACCENT}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  stateIco: {
    width: 48, height: 48,
  },
  stateText: { color: '#AAAAAA', fontSize: '0.95rem' },
  resetBtn: {
    padding: '8px 20px', borderRadius: 20,
    border: '1px solid rgba(0,0,0,0.15)',
    background: 'transparent', color: '#555555',
    fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },

  /* 그리드 */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 18,
  },

  /* 카드 */
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 18,
    padding: '24px 22px',
    textDecoration: 'none',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },

  cardTop: {
    display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap',
  },
  typeGreen: {
    padding: '3px 9px', borderRadius: 20,
    fontSize: '0.72rem', fontWeight: 700,
    background: '#D1FAE5', color: '#059669',
    border: '1px solid #A7F3D0',
    flexShrink: 0,
  },
  typeAmber: {
    padding: '3px 9px', borderRadius: 20,
    fontSize: '0.72rem', fontWeight: 700,
    background: '#FEF3C7', color: '#D97706',
    border: '1px solid #FDE68A',
    flexShrink: 0,
  },
  catBadge: {
    padding: '3px 9px', borderRadius: 20,
    fontSize: '0.72rem', fontWeight: 600,
    background: '#F0F0EE', color: '#555555',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  ddayBadge: {
    marginLeft: 'auto',
    padding: '3px 10px', borderRadius: 20,
    fontSize: '0.75rem', fontWeight: 900,
    flexShrink: 0,
  },

  cardTitle: {
    fontSize: '1rem', fontWeight: 800,
    color: '#0D0D0D', lineHeight: 1.45,
    letterSpacing: '-0.2px',
  },
  cardOrg: {
    fontSize: '0.8rem', fontWeight: 600,
    color: '#888888',
  },

  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 5 },
  tag: {
    padding: '2px 9px', borderRadius: 20,
    background: '#F5F5F3', color: '#888888',
    fontSize: '0.73rem',
    border: '1px solid rgba(0,0,0,0.08)',
  },

  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: '1px solid rgba(0,0,0,0.07)',
  },
  amount: {
    fontSize: '0.82rem', fontWeight: 700, color: ACCENT,
  },
  deadline: {
    fontSize: '0.78rem', color: '#AAAAAA', fontWeight: 500,
  },

  desc: {
    fontSize: '0.82rem', color: '#888888',
    lineHeight: 1.75,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  link: {
    fontSize: '0.82rem', fontWeight: 700,
    color: '#0D0D0D', marginTop: 'auto',
  },
}
