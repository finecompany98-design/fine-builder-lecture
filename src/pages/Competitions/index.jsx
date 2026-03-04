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
  if (label === '마감') return '#6B7280'
  if (label === 'D-DAY') return '#EF4444'
  const n = parseInt(label.replace('D-', ''))
  if (n <= 7) return '#F59E0B'
  return '#6C3CE1'
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
        q = query(col,
          where('isActive', '==', true),
          where('category', '==', activeCategory),
          where('type', '==', activeType),
          orderBy('deadline'))
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
    <main id="main" style={styles.main}>
      <div style={styles.inner}>

        {/* 헤더 */}
        <div style={styles.pageHeader}>
          <h1 style={styles.title}>🏆 공모·지원사업</h1>
          <p style={styles.subtitle}>
            한국문화예술위원회, 서울문화재단 등 공공기관·재단의<br />
            실제 공모전과 지원사업 정보를 모았습니다.
          </p>
          {/* 최초 1회 데이터 등록 버튼 (관리자용) */}
          {items.length === 0 && !loading && (
            <button onClick={handleSeed} disabled={seeding} style={styles.seedBtn}>
              {seeding ? '등록 중...' : '📥 초기 데이터 등록 (최초 1회)'}
            </button>
          )}
        </div>

        {/* 검색 */}
        <div style={styles.searchWrap}>
          <input
            type="search"
            placeholder="공모명, 기관명, 분야로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* 분야 필터 */}
        <div style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.filterBtn,
                background: activeCategory === cat ? 'linear-gradient(135deg,#6C3CE1,#8B5CF6)' : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat ? '#fff' : 'rgba(240,235,248,0.65)',
                border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 유형 필터 */}
        <div style={styles.filterRow}>
          {TYPES.map(tp => (
            <button
              key={tp}
              onClick={() => setActiveType(tp)}
              style={{
                ...styles.filterBtn,
                background: activeType === tp ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)',
                color: activeType === tp ? '#F59E0B' : 'rgba(240,235,248,0.65)',
                border: activeType === tp ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        {!loading && (
          <p style={styles.count}>총 {filtered.length}건</p>
        )}

        {/* 카드 목록 */}
        {loading ? (
          <p style={styles.loading}>불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.empty}>해당하는 공모·지원사업이 없습니다.</p>
        ) : (
          <div style={styles.grid}>
            {filtered.map(item => {
              const ddayLabel = dday(item.deadline)
              const color = ddayColor(ddayLabel)
              return (
                <a
                  key={item.id}
                  href={item.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.card}
                >
                  {/* 상단 배지 */}
                  <div style={styles.cardTop}>
                    <span style={item.type === '지원사업' ? styles.badgeGreen : styles.badgeAmber}>
                      {item.type}
                    </span>
                    <span style={styles.badgePurple}>
                      {item.category}
                    </span>
                    <span style={{ ...styles.dday, color, border: `1px solid ${color}` }}>
                      {ddayLabel}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h2 style={styles.cardTitle}>{item.title}</h2>
                  <p style={styles.cardOrg}>📌 {item.organization}</p>

                  {/* 분야 태그 */}
                  <div style={styles.tagRow}>
                    {(item.fields || []).slice(0, 4).map(f => (
                      <span key={f} style={styles.tag}>{f}</span>
                    ))}
                  </div>

                  {/* 지원금 / 마감일 */}
                  <div style={styles.cardMeta}>
                    <span style={styles.amount}>💰 {item.amount}</span>
                    <span style={styles.deadline}>
                      마감 {item.deadline?.toDate
                        ? item.deadline.toDate().toLocaleDateString('ko-KR')
                        : '미정'}
                    </span>
                  </div>

                  <p style={styles.desc}>{item.description}</p>
                  <span style={styles.link}>공식 사이트에서 확인 →</span>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

const styles = {
  main: { padding: '60px 24px 80px' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  pageHeader: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: 12 },
  subtitle: { color: 'rgba(240,235,248,0.6)', lineHeight: 1.8, fontSize: '1rem' },
  seedBtn: {
    marginTop: 20, padding: '12px 24px',
    background: 'rgba(108,60,225,0.3)', border: '1px solid #6C3CE1',
    color: '#C4B5FD', borderRadius: 12, fontFamily: 'inherit',
    fontSize: '0.95rem', cursor: 'pointer',
  },
  searchWrap: { marginBottom: 20 },
  searchInput: {
    width: '100%', padding: '13px 20px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, color: '#fff', fontSize: '1rem',
    fontFamily: 'inherit', outline: 'none',
  },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterBtn: {
    padding: '7px 16px', borderRadius: 20,
    fontSize: '0.85rem', fontWeight: 600,
    fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
  },
  count: { color: 'rgba(240,235,248,0.4)', fontSize: '0.85rem', marginBottom: 20, marginTop: 8 },
  loading: { textAlign: 'center', color: 'rgba(240,235,248,0.4)', padding: 60 },
  empty: { textAlign: 'center', color: 'rgba(240,235,248,0.4)', padding: 60 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
  },
  card: {
    display: 'block',
    background: 'rgba(26,16,48,0.85)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '24px',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'pointer', textDecoration: 'none',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 },
  badgeGreen: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: 'rgba(34,197,94,0.15)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.3)',
  },
  badgeAmber: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.3)',
  },
  badgePurple: {
    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: 'rgba(139,92,246,0.15)', color: '#C4B5FD', border: '1px solid rgba(196,181,253,0.3)',
  },
  dday: {
    marginLeft: 'auto', padding: '3px 10px',
    borderRadius: 20, fontSize: '0.8rem', fontWeight: 900,
    background: 'transparent',
  },
  cardTitle: { fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.4 },
  cardOrg: { color: '#C4B5FD', fontSize: '0.85rem', marginBottom: 12 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: {
    padding: '3px 10px', borderRadius: 20,
    background: 'rgba(255,255,255,0.07)',
    color: 'rgba(240,235,248,0.6)', fontSize: '0.78rem',
  },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  amount: { color: '#F59E0B', fontWeight: 700, fontSize: '0.9rem' },
  deadline: { color: 'rgba(240,235,248,0.45)', fontSize: '0.8rem' },
  desc: { color: 'rgba(240,235,248,0.55)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: 16 },
  link: { color: '#8B5CF6', fontSize: '0.85rem', fontWeight: 700 },
}
