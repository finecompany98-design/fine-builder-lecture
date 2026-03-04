import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const location = useLocation()
  const [fontSize, setFontSize] = useState('normal')
  const { isAdmin } = useAuth()

  const handleFont = (size) => {
    setFontSize(size)
    document.documentElement.className = document.documentElement.className
      .replace(/font-\w+/g, '')
    document.documentElement.classList.add(`font-${size}`)
  }

  const navLinks = [
    { to: '/competitions', label: '공모·지원사업', icon: '🏆' },
    { to: '/ai-recommend', label: 'AI 추천', icon: '✨' },
  ]

  return (
    <header style={styles.header} role="banner">
      <div style={styles.inner}>

        {/* 로고 */}
        <Link to="/" style={styles.logo} aria-label="모두의 예술 홈으로 이동">
          <span aria-hidden="true" style={styles.logoIcon}>✦</span>
          <span style={styles.logoText}>모두의 예술</span>
        </Link>

        {/* 글자 크기 조절 */}
        <div role="group" aria-label="글자 크기 조절" style={styles.fontControls}>
          {['small', 'normal', 'large'].map((size, i) => (
            <button
              key={size}
              onClick={() => handleFont(size)}
              aria-label={['글자 작게', '글자 보통', '글자 크게'][i]}
              aria-pressed={fontSize === size}
              style={{
                ...styles.fontBtn,
                fontSize: [13, 16, 20][i],
                opacity: fontSize === size ? 1 : 0.5,
                background: fontSize === size ? 'rgba(108,60,225,0.3)' : 'transparent',
              }}
            >
              가
            </button>
          ))}
        </div>

        {/* 네비게이션 */}
        <nav role="navigation" aria-label="주요 메뉴" style={styles.nav}>
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.navLink,
                color: location.pathname === to ? '#fff' : 'rgba(240,235,248,0.7)',
              }}
            >
              <span aria-hidden="true">{icon}</span> {label}
            </Link>
          ))}

          {/* 관리자 전용 등록 버튼 */}
          {isAdmin && (
            <Link to="/admin" style={styles.adminBtn}>
              ＋ 등록
            </Link>
          )}

          <Link to="/auth" style={styles.navCta}>시작하기 →</Link>
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(15,10,30,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 24px',
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', alignItems: 'center',
    gap: 24, height: 64,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontWeight: 900, fontSize: '1.25rem',
    marginRight: 'auto',
  },
  logoIcon: { color: '#8B5CF6', fontSize: '1.4rem' },
  logoText: { color: '#fff' },
  fontControls: { display: 'flex', gap: 4 },
  fontBtn: {
    padding: '4px 8px', borderRadius: 8,
    color: '#fff', transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 8 },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 12px', borderRadius: 10,
    fontSize: '0.9rem', fontWeight: 500,
    transition: 'color 0.2s',
  },
  adminBtn: {
    padding: '6px 14px', borderRadius: 10,
    border: '1px solid rgba(245,158,11,0.4)',
    color: '#F59E0B', fontSize: '0.85rem', fontWeight: 700,
  },
  navCta: {
    background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)',
    color: '#fff', padding: '8px 18px',
    borderRadius: 20, fontWeight: 700,
    fontSize: '0.9rem', marginLeft: 8,
  },
}
