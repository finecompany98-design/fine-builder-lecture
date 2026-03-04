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
    <header style={s.header} role="banner">
      <div style={s.inner}>

        <Link to="/" style={s.logo} aria-label="fine:D 홈으로 이동">
          <span style={s.logoText}>Fine</span><span style={s.logoAccent}>:D</span>
        </Link>

        <div role="group" aria-label="글자 크기 조절" style={s.fontControls}>
          {['small', 'normal', 'large'].map((size, i) => (
            <button
              key={size}
              onClick={() => handleFont(size)}
              aria-label={['글자 작게', '글자 보통', '글자 크게'][i]}
              aria-pressed={fontSize === size}
              style={{
                ...s.fontBtn,
                fontSize: [13, 16, 20][i],
                background: fontSize === size ? '#EBEBEB' : 'transparent',
                color: fontSize === size ? '#111111' : '#6B6585',
              }}
            >가</button>
          ))}
        </div>

        <nav role="navigation" aria-label="주요 메뉴" style={s.nav}>
          {navLinks.map(({ to, label, icon }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link key={to} to={to} style={{
                ...s.navLink,
                color: active ? '#111111' : '#444444',
                fontWeight: active ? 700 : 500,
                background: active ? '#EBEBEB' : 'transparent',
              }}>
                <span aria-hidden="true">{icon}</span> {label}
              </Link>
            )
          })}

          {isAdmin && (
            <Link to="/admin" style={s.adminBtn}>＋ 등록</Link>
          )}

          <Link to="/auth" style={s.navCta}>시작하기 →</Link>
        </nav>
      </div>
    </header>
  )
}

const s = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
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
  logoText: { color: '#1A1027' },
  logoAccent: { color: '#111111' },
  fontControls: { display: 'flex', gap: 4 },
  fontBtn: {
    padding: '4px 8px', borderRadius: 8,
    transition: 'all 0.2s', fontFamily: 'inherit',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 4 },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 12px', borderRadius: 10,
    fontSize: '0.9rem', transition: 'all 0.2s',
  },
  adminBtn: {
    padding: '6px 14px', borderRadius: 10,
    border: '1px solid rgba(245,158,11,0.5)',
    color: '#D97706', fontSize: '0.85rem', fontWeight: 700,
  },
  navCta: {
    background: '#111111',
    color: '#fff', padding: '8px 18px',
    borderRadius: 20, fontWeight: 700,
    fontSize: '0.9rem', marginLeft: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
  },
}
