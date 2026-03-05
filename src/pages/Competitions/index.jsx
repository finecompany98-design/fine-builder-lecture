import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import './Competitions.css'

const CATEGORIES = ['전체', '전 분야', '시각예술', '공연예술', '문학', '음악', '무용', '영상·미디어', '공예·디자인']
const TYPES = ['전체', '지원사업', '공모전']

function dday(deadline) {
  if (!deadline) return null
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0)  return { label: '마감',   type: 'closed' }
  if (diff === 0) return { label: 'D-DAY',  type: 'today'  }
  if (diff <= 7)  return { label: `D-${diff}`, type: 'urgent' }
  return           { label: `D-${diff}`, type: 'normal' }
}

function fmtDate(deadline) {
  if (!deadline) return '미정'
  const d = deadline.toDate ? deadline.toDate() : new Date(deadline)
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

/* ── Mobile chip filter bar ── */
function MobileFilters({ activeCategory, setActiveCategory, activeType, setActiveType }) {
  return (
    <div className="comp-mobile-filters">
      <div className="comp-mobile-filter-row">
        {TYPES.map(tp => (
          <button
            key={tp}
            className={`comp-mobile-chip ${activeType === tp ? 'is-type-active' : ''}`}
            onClick={() => setActiveType(tp)}
          >{tp}</button>
        ))}
        <div className="comp-mobile-divider-v" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`comp-mobile-chip ${activeCategory === cat ? 'is-cat-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>
    </div>
  )
}

/* ── Featured card (first result) ── */
function FeaturedCard({ item }) {
  const dd = dday(item.deadline)
  const isSupport = item.type === '지원사업'
  return (
    <a
      href={item.orgUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="comp-featured-card"
    >
      {/* Blue gradient left panel */}
      <div className="comp-featured-left">
        {dd && <span className="comp-featured-dday">{dd.label}</span>}
        <span className="comp-featured-idx">01</span>
        <span className="comp-featured-arrow-icon">→</span>
      </div>

      {/* Right body */}
      <div className="comp-featured-body">
        <div className="comp-featured-badges">
          <span className={`comp-type-badge ${isSupport ? 'is-green' : 'is-blue'}`}>
            {item.type}
          </span>
          <span className="comp-cat-badge">{item.category}</span>
          <span className="comp-featured-label">FEATURED</span>
        </div>

        <h2 className="comp-featured-title">{item.title}</h2>
        <p className="comp-featured-org">{item.organization}</p>

        {item.description && (
          <p className="comp-featured-desc">{item.description}</p>
        )}

        <div className="comp-featured-footer">
          {item.amount && (
            <span className="comp-featured-amount">{item.amount}</span>
          )}
          <span className="comp-featured-deadline">마감 {fmtDate(item.deadline)}</span>
          {(item.fields || []).length > 0 && (
            <div className="comp-featured-tags">
              {(item.fields || []).slice(0, 3).map(f => (
                <span key={f} className="comp-tag">{f}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

/* ── Regular card ── */
function CompCard({ item }) {
  const dd = dday(item.deadline)
  const isSupport = item.type === '지원사업'
  return (
    <a
      href={item.orgUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`comp-card ${isSupport ? 'is-support' : 'is-contest'}`}
    >
      {dd && (
        <span className={`comp-dday-badge is-${dd.type}`}>{dd.label}</span>
      )}

      <div className="comp-card-inner">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`comp-type-badge ${isSupport ? 'is-green' : 'is-blue'}`}>
            {item.type}
          </span>
          <span className="comp-cat-badge">{item.category}</span>
        </div>

        <h2 className="comp-card-title">{item.title}</h2>
        <p className="comp-card-org">{item.organization}</p>

        {(item.fields || []).length > 0 && (
          <div className="comp-tag-row">
            {(item.fields || []).slice(0, 3).map(f => (
              <span key={f} className="comp-tag">{f}</span>
            ))}
          </div>
        )}

        <div className="comp-card-meta">
          {item.amount
            ? <span className="comp-amount">{item.amount}</span>
            : <span />
          }
          <span className="comp-deadline">마감 {fmtDate(item.deadline)}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="comp-card-overlay" aria-hidden="true">
        <span className="comp-card-overlay-text">공식 사이트</span>
        <span className="comp-card-overlay-arrow">→</span>
      </div>
    </a>
  )
}

/* ════════════════════════════════ */

export default function Competitions() {
  const [searchParams] = useSearchParams()
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '전체')
  const [activeType, setActiveType] = useState(searchParams.get('type') || '전체')
  const [search, setSearch]         = useState('')
  const [isMobile, setIsMobile]     = useState(() => window.innerWidth < 900)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'competitions'))
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
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
        setFetchError(e.message || String(e))
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

  const featuredItem = filtered[0]
  const gridItems    = filtered.slice(1)

  const catCount = cat => items.filter(i => i.category === cat).length
  const typeCount = tp  => items.filter(i => i.type === tp).length

  function resetFilters() {
    setActiveCategory('전체')
    setActiveType('전체')
    setSearch('')
  }

  return (
    <main id="main" className="comp-page">

      {/* ══ HERO ══ */}
      <section className="comp-hero">
        <div className="comp-hero-inner">

          {/* Left: editorial type */}
          <div>
            <span className="comp-hero-eyebrow">◎ FINE:D CURATED</span>
            <h1 className="comp-hero-title">
              공모·<br />
              <span className="comp-hero-title-dim">지원사업</span>
            </h1>
            <p className="comp-hero-sub">
              공공기관·재단의 실제 공모전과<br />
              지원사업 정보를 한데 모았습니다
            </p>
          </div>

          {/* Right: search bar */}
          <div className="comp-hero-search-wrap" role="search">
            <svg className="comp-hero-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              className="comp-hero-search-input"
              placeholder="공모명, 기관명, 분야 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="공모 검색"
            />
            <span className="comp-hero-search-shortcut">⏎</span>
          </div>

        </div>
        <span className="comp-hero-bg-text" aria-hidden="true">OPEN CALL</span>
      </section>

      {/* ══ BODY LAYOUT ══ */}
      <div className="comp-layout">

        {/* Sidebar or mobile chips */}
        {isMobile ? (
          <MobileFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        ) : (
          <aside className="comp-sidebar">
            {/* 분야 */}
            <div className="comp-sidebar-group">
              <p className="comp-sidebar-section-label">분야</p>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`comp-sidebar-item ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="comp-sidebar-radio" />
                  <span>{cat}</span>
                  {cat !== '전체' && catCount(cat) > 0 && (
                    <span className="comp-sidebar-count">{catCount(cat)}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="comp-sidebar-divider" />

            {/* 유형 */}
            <div className="comp-sidebar-group">
              <p className="comp-sidebar-section-label">유형</p>
              {TYPES.map(tp => (
                <button
                  key={tp}
                  className={`comp-sidebar-item ${activeType === tp ? 'is-type-active' : ''}`}
                  onClick={() => setActiveType(tp)}
                >
                  <span className="comp-sidebar-radio" />
                  <span>{tp}</span>
                  {tp !== '전체' && typeCount(tp) > 0 && (
                    <span className="comp-sidebar-count">{typeCount(tp)}</span>
                  )}
                </button>
              ))}
            </div>

            {(activeCategory !== '전체' || activeType !== '전체') && (
              <button className="comp-sidebar-reset" onClick={resetFilters}>
                필터 초기화
              </button>
            )}
          </aside>
        )}

        {/* Main content */}
        <section>

          {/* Fetch error */}
          {fetchError && (
            <div style={{ background:'#FEE2E2', border:'1px solid #FCA5A5', borderRadius:12, padding:'14px 18px', marginBottom:20, fontSize:'0.85rem', color:'#991B1B', lineHeight:1.7 }}>
              <strong>데이터 로드 오류:</strong> {fetchError}
              <br/>
              <span style={{ opacity:0.75 }}>Firebase 콘솔 → Firestore → 규칙에서 읽기 권한을 확인해주세요.</span>
            </div>
          )}

          {/* Results bar */}
          {!loading && (
            <div className="comp-results-bar">
              <span className="comp-results-count">
                <strong>{filtered.length}</strong>건의 공모·지원사업
              </span>
              {search && (
                <span className="comp-results-query">"{search}" 검색 결과</span>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="comp-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="comp-skeleton-card">
                  <div className="comp-skeleton-line comp-skeleton-line--top" />
                  <div className="comp-skeleton-line comp-skeleton-line--title" />
                  <div className="comp-skeleton-line comp-skeleton-line--title2" />
                  <div className="comp-skeleton-line comp-skeleton-line--sub" />
                  <div className="comp-skeleton-line comp-skeleton-line--tags" />
                  <div className="comp-skeleton-line comp-skeleton-line--meta" />
                </div>
              ))}
            </div>

          /* Empty state */
          ) : filtered.length === 0 ? (
            <div className="comp-empty">
              <svg className="comp-empty-icon" viewBox="0 0 48 48" fill="none">
                <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="2.2" />
                <path d="M32 32l8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <p className="comp-empty-text">해당하는 공모·지원사업이 없습니다</p>
              <button className="comp-empty-reset" onClick={resetFilters}>
                필터 초기화
              </button>
            </div>

          /* Results */
          ) : (
            <>
              {featuredItem && <FeaturedCard item={featuredItem} />}
              {gridItems.length > 0 && (
                <div className="comp-grid">
                  {gridItems.map(item => (
                    <CompCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}

        </section>
      </div>

    </main>
  )
}
