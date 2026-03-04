import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')

  const categories = [
    { to: '/competitions?type=공모전', emoji: '🏆', name: '공모전', desc: '예술 분야별\n공모전 정보', label: '공모전 보기' },
    { to: '/competitions?type=지원사업', emoji: '🌱', name: '지원사업', desc: '공공기관·재단\n지원사업 정보', label: '지원사업 보기' },
    { to: '/competitions?category=시각예술', emoji: '🎨', name: '시각예술', desc: '회화·조각·사진\n미디어아트', label: '시각예술 공모 보기' },
    { to: '/competitions?category=공연예술', emoji: '🎭', name: '공연예술', desc: '연극·무용·음악\n공연예술 분야', label: '공연예술 공모 보기' },
    { to: '/competitions?category=문학', emoji: '📝', name: '문학·출판', desc: '시·소설·에세이\n출판 지원', label: '문학 공모 보기' },
    { to: '/ai-recommend', emoji: '🤖', name: 'AI 추천', desc: '내 분야에 맞는\n맞춤 추천', label: 'AI 맞춤 추천 받기' },
  ]

  const audience = [
    { emoji: '🎨', title: '작가·예술인', desc: '회화, 조각, 사진 등 시각예술 분야 공모전과 창작 지원사업을 찾아보세요' },
    { emoji: '🎭', title: '공연·무용·음악인', desc: '연극, 무용, 음악 분야의 창작 지원금과 발표 기회를 확인하세요' },
    { emoji: '✍️', title: '작가·문인', desc: '시, 소설, 에세이, 출판 지원사업과 문학상 공모를 한눈에 보세요' },
  ]

  return (
    <main id="main">

      {/* 히어로 섹션 */}
      <section style={styles.hero} aria-labelledby="hero-title">
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>문화예술 플랫폼</p>
          <h1 id="hero-title" style={styles.heroTitle}>
            누구나 즐기는<br />
            <span style={styles.highlight}>모두의 예술</span>
          </h1>
          <p style={styles.heroDesc}>
            공공기관·재단의 공모전과 지원사업 정보를<br />
            한곳에서, AI가 내 분야에 맞게 추천해드립니다.
          </p>

          {/* 검색바 */}
          <div role="search" style={styles.searchBar}>
            <label htmlFor="search-input" className="sr-only">검색어 입력</label>
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="전시, 공연, 공모전을 검색해보세요"
              aria-label="전시, 공연, 공모전 검색"
              style={styles.searchInput}
            />
            <button style={styles.searchBtn} aria-label="검색">
              🔍 검색
            </button>
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section style={styles.section} aria-labelledby="categories-title">
        <div style={styles.sectionInner}>
          <h2 id="categories-title" style={styles.sectionTitle}>무엇을 찾으시나요?</h2>
          <div style={styles.categoryGrid}>
            {categories.map(({ to, emoji, name, desc, label }) => (
              <Link key={to} to={to} style={styles.categoryCard} aria-label={label}>
                <span style={styles.categoryEmoji} aria-hidden="true">{emoji}</span>
                <strong style={styles.categoryName}>{name}</strong>
                <p style={styles.categoryDesc}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 이런 분들께 */}
      <section style={styles.section} aria-labelledby="audience-title">
        <div style={styles.sectionInner}>
          <h2 id="audience-title" style={styles.sectionTitle}>이런 분들께 추천해요</h2>
          <div style={styles.audienceGrid}>
            {audience.map(({ emoji, title, desc }) => (
              <div key={title} style={styles.audienceCard}>
                <span style={styles.audienceEmoji} aria-hidden="true">{emoji}</span>
                <strong style={styles.audienceTitle}>{title}</strong>
                <p style={styles.audienceDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}

const styles = {
  hero: {
    padding: '80px 24px 60px',
    background: 'radial-gradient(ellipse at 60% 40%, rgba(108,60,225,0.25) 0%, transparent 70%)',
    textAlign: 'center',
  },
  heroContent: { maxWidth: 700, margin: '0 auto' },
  heroTag: {
    display: 'inline-block',
    background: 'rgba(108,60,225,0.2)',
    border: '1px solid rgba(139,92,246,0.4)',
    color: '#C4B5FD', padding: '6px 16px',
    borderRadius: 20, fontSize: '0.85rem',
    fontWeight: 600, marginBottom: 20,
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 900, lineHeight: 1.2,
    marginBottom: 20, color: '#fff',
  },
  highlight: {
    background: 'linear-gradient(135deg, #8B5CF6, #F59E0B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDesc: {
    fontSize: '1.1rem', color: 'rgba(240,235,248,0.7)',
    marginBottom: 36, lineHeight: 1.8,
  },
  searchBar: {
    display: 'flex', maxWidth: 560, margin: '0 auto',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 50, overflow: 'hidden',
  },
  searchInput: {
    flex: 1, padding: '14px 20px',
    background: 'transparent', border: 'none', outline: 'none',
    color: '#fff', fontSize: '1rem', fontFamily: 'inherit',
  },
  searchBtn: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)',
    color: '#fff', fontWeight: 700, fontSize: '0.95rem',
    fontFamily: 'inherit', whiteSpace: 'nowrap',
  },
  section: { padding: '60px 24px' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionTitle: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 900, textAlign: 'center',
    marginBottom: 40, color: '#fff',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
  },
  categoryCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '36px 24px', borderRadius: 20,
    background: 'rgba(26,16,48,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center', transition: 'transform 0.2s, border-color 0.2s',
    cursor: 'pointer',
  },
  categoryEmoji: { fontSize: '2.5rem', marginBottom: 12 },
  categoryName: { fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: '#fff' },
  categoryDesc: { fontSize: '0.9rem', color: 'rgba(240,235,248,0.6)', whiteSpace: 'pre-line' },
  audienceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },
  audienceCard: {
    padding: '32px 28px', borderRadius: 20,
    background: 'rgba(26,16,48,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  audienceEmoji: { fontSize: '2rem', display: 'block', marginBottom: 12 },
  audienceTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'block', marginBottom: 10 },
  audienceDesc: { fontSize: '0.9rem', color: 'rgba(240,235,248,0.6)', lineHeight: 1.7 },
}
