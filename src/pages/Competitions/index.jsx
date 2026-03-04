import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { seedCompetitions } from '../../services/competitions.service'
import { seedItems } from '../../data/seedData'

const CATEGORIES = ['전체', '전 분야', '시각예술', '공연예술', '문학', '음악', '무용', '영상·미디어', '공예·디자인']
const TYPES = ['전체', '지원사업', '공모전']

function dday(deadline) {
  if (!deadline) return null
  const now = new Date()
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '마감'
  if (diff === 0) return 'D-DAY'
  return `D-${diff}`
}

function ddayColor(label) {
  if (label === '마감') return { bg: '#F3F4F6', text: '#9CA3AF' }
  if (label === 'D-DAY') return { bg: '#FEE2E2', text: '#EF4444' }
  const n = parseInt(label.replace('D-', ''))
  if (n <= 7) return { bg: '#FEF3C7', text: '#D97706' }
  return { bg: '#EBEBEB', text: '#111111' }
}

export default function Competitions() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '전체')
  const [activeType, setActiveType] = useState(searchParams.get('type') || '전체')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [activeCategory, activeType])

  async function fetchData() {
    setLoading(true)
    try {
      let q
      const col = collection(db, 'competitions')
      if (activeCategory !== '전체' && activeType !== '전체') {
        q = query(col, where('isActive', '==', true), where('category', '==', activeCategory), where('type', '==', activeType), orderBy('deadline'))
      } else if (activeCategory !== '전체') {
        q = query(col, where('isActive', '==', true), where('category', '==', activeCategory), orderBy('deadline'))
      } else if (activeType !== '전체') {
        q = query(col, where('isActive', '==', true), where('type', '==', activeType), orderBy('deadline'))
      } else {
        q = query(col, where('isActive', '==', true), orderBy('deadline'))
      }
      const snap = await getDocs(q)
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSeed() {
    if (!confirm('시드 데이터를 Firestore에 등록할까요? (최초 1회만 실행하세요)')) return
    setSeeding(true)
    try {
      await seedCompetitions(seedItems)
      alert('등록 완료! 페이지를 새로고침하세요.')
      fetchData()
    } catch (e) {
      alert('오류: ' + e.message)
    } finally {
      setSeeding(false)
    }
  }

  const filtered = items.filter(item =>
    !search || item.title.includes(search) || item.organization.includes(search) ||
    (item.fields || []).some(f => f.includes(search))
  )

  return (
    <main id="main" style={s.main}>
      <div style={s.inner}>

        {/* 페이지 헤더 */}
        <div style={s.pageHeader}>
          <h1 style={s.title}>공모·지원사업</h1>
          <p style={s.subtitle}>
            한국문화예술위원회, 서울문화재단 등 공공기관·재단의<br />
            실제 공모전과 지원사업 정보를 모았습니다.
          </p>
          {items.length === 0 && !loading && (
            <button onClick={handleSeed} disabled={seeding} style={s.seedBtn}>
              {seeding ? '등록 중...' : '📥 초기 데이터 등록 (최초 1회)'}
            </button>
          )}
        </div>

        {/* 검색 */}
        <div style={s.searchWrap} role="search">
          <label htmlFor="comp-search" className="sr-only">공모 검색</label>
          <span style={s.searchIcon} aria-hidden="true">🔍</span>
          <input
            id="comp-search"
            type="search"
            placeholder="공모명, 기관명, 분야로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>

        {/* 필터 바 */}
        <div style={s.filterPanel}>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>분야</span>
            <div style={s.filterRow}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    ...s.filterBtn,
                    background: activeCategory === cat ? '#111111' : '#fff',
                    color: activeCategory === cat ? '#fff' : '#444444',
                    border: activeCategory === cat ? '1px solid #111111' : '1px solid rgba(0,0,0,0.2)',
                    fontWeight: activeCategory === cat ? 700 : 500,
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>유형</span>
            <div style={s.filterRow}>
              {TYPES.map(tp => (
                <button
                  key={tp}
                  onClick={() => setActiveType(tp)}
                  style={{
                    ...s.filterBtn,
                    background: activeType === tp ? '#F59E0B' : '#fff',
                    color: activeType === tp ? '#fff' : '#444444',
                    border: activeType === tp ? '1px solid #F59E0B' : '1px solid rgba(0,0,0,0.2)',
                    fontWeight: activeType === tp ? 700 : 500,
                  }}
                >{tp}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 수 */}
        {!loading && (
          <p style={s.count}>총 <strong style={{ color: '#111111' }}>{filtered.length}</strong>건</p>
        )}

        {/* 카드 목록 */}
        {loading ? (
          <div style={s.stateBox}>
            <span style={s.stateIcon}>⏳</span>
            <p style={s.stateText}>불러오는 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.stateBox}>
            <span style={s.stateIcon}>🔎</span>
            <p style={s.stateText}>해당하는 공모·지원사업이 없습니다.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map(item => {
              const ddayLabel = dday(item.deadline)
              const { bg: ddayBg, text: ddayText } = ddayColor(ddayLabel)
              return (
                <a
                  key={item.id}
                  href={item.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.card}
                >
                  {/* 배지 행 */}
                  <div style={s.cardTop}>
                    <span style={item.type === '지원사업' ? s.badgeGreen : s.badgeAmber}>
                      {item.type}
                    </span>
                    <span style={s.badgePurple}>{item.category}</span>
                    {ddayLabel && (
                      <span style={{ ...s.ddayBadge, background: ddayBg, color: ddayText }}>
                        {ddayLabel}
                      </span>
                    )}
                  </div>

                  {/* 본문 */}
                  <h2 style={s.cardTitle}>{item.title}</h2>
                  <p style={s.cardOrg}>📌 {item.organization}</p>

                  <div style={s.tagRow}>
                    {(item.fields || []).slice(0, 4).map(f => (
                      <span key={f} style={s.tag}>{f}</span>
                    ))}
                  </div>

                  <div style={s.cardMeta}>
                    <span style={s.amount}>💰 {item.amount}</span>
                    <span style={s.deadline}>
                      마감 {item.deadline?.toDate
                        ? item.deadline.toDate().toLocaleDateString('ko-KR')
                        : '미정'}
                    </span>
                  </div>

                  <p style={s.desc}>{item.description}</p>
                  <span style={s.link}>공식 사이트에서 확인 →</span>
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
  main: { padding: '48px 24px 80px', background: '#F8F8F8', minHeight: '80vh' },
  inner: { maxWidth: 1100, margin: '0 auto' },

  pageHeader: { marginBottom: 36 },
  title: {
    fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
    fontWeight: 900, color: '#111111', marginBottom: 10,
  },
  subtitle: { color: '#888888', lineHeight: 1.8, fontSize: '1rem' },
  seedBtn: {
    marginTop: 20, padding: '11px 22px',
    background: '#EBEBEB', border: '1px solid #111111',
    color: '#111111', borderRadius: 12, fontSize: '0.9rem',
    fontWeight: 700, cursor: 'pointer',
  },

  searchWrap: {
    position: 'relative', marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute', left: 16, top: '50%',
    transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', padding: '13px 20px 13px 44px',
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.2)',
    borderRadius: 12, color: '#111111', fontSize: '1rem',
    fontFamily: 'inherit', outline: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },

  filterPanel: {
    background: '#fff', borderRadius: 16,
    padding: '20px 24px', marginBottom: 24,
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  filterGroup: { display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  filterLabel: {
    fontSize: '0.78rem', fontWeight: 700, color: '#888888',
    letterSpacing: '0.06em', paddingTop: 6, whiteSpace: 'nowrap',
  },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  filterBtn: {
    padding: '6px 15px', borderRadius: 20,
    fontSize: '0.85rem', transition: 'all 0.15s',
    fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  count: { color: '#888888', fontSize: '0.88rem', marginBottom: 20 },

  stateBox: { textAlign: 'center', padding: '80px 0' },
  stateIcon: { fontSize: '2.5rem', display: 'block', marginBottom: 16 },
  stateText: { color: '#888888', fontSize: '1rem' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
  },
  card: {
    display: 'block',
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: 20, padding: '24px',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },

  cardTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  badgeGreen: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0',
  },
  badgeAmber: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
  },
  badgePurple: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#EBEBEB', color: '#111111', border: '1px solid #DDDDDD',
  },
  ddayBadge: {
    marginLeft: 'auto', padding: '3px 10px',
    borderRadius: 20, fontSize: '0.8rem', fontWeight: 900,
  },

  cardTitle: { fontSize: '1.05rem', fontWeight: 800, color: '#111111', marginBottom: 6, lineHeight: 1.4 },
  cardOrg: { color: '#111111', fontSize: '0.85rem', marginBottom: 14, fontWeight: 600 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: {
    padding: '3px 10px', borderRadius: 20,
    background: '#F5F5F5', color: '#888888', fontSize: '0.78rem',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  amount: { color: '#D97706', fontWeight: 700, fontSize: '0.9rem' },
  deadline: { color: '#9CA3AF', fontSize: '0.8rem' },
  desc: { color: '#888888', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 },
  link: { color: '#111111', fontSize: '0.85rem', fontWeight: 700 },
}
