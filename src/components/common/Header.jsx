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
                fontSize: [12, 15, 18][i],
                background: fontSize === size ? '#fff' : 'transparent',
                color: fontSize === size ? '#0D0D0D' : '#8A8A8A',
                boxShadow: fontSize === size ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
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
                color: active ? '#0D0D0D' : '#5A5A5A',
                fontWeight: active ? 700 : 500,
                background: active ? '#ECECEA' : 'transparent',
              }}>
                <span aria-hidden="true" style={{ fontSize: 14 }}>{icon}</span>
                {label}
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
    background: 'rgba(250,250,249,0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(0,0,0,0.09)',
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', alignItems: 'center',
    gap: 16, height: 64,
    padding: '0 28px',
  },
  logo: {
    display: 'flex', alignItems: 'baseline',
    gap: 1, marginRight: 'auto',
    letterSpacing: '-0.5px',
  },
  logoText: {
    fontWeight: 900, fontSize: '1.2rem',
    color: '#0D0D0D',
  },
  logoAccent: {
    fontWeight: 900, fontSize: '1.2rem',
    color: '#3747FF',
  },
  fontControls: {
    display: 'flex', gap: 2,
    background: '#F2F2F0',
    padding: '3px',
    borderRadius: 8,
  },
  fontBtn: {
    padding: '4px 9px', borderRadius: 6,
    border: 'none',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    cursor: 'pointer',
    lineHeight: 1,
  },
  nav: { display: 'flex', alignItems: 'center', gap: 2 },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '7px 12px', borderRadius: 8,
    fontSize: '0.875rem', transition: 'all 0.15s',
    letterSpacing: '-0.2px',
  },
  adminBtn: {
    padding: '6px 12px', borderRadius: 8,
    border: '1px solid rgba(55,71,255,0.3)',
    color: '#3747FF', fontSize: '0.82rem', fontWeight: 700,
    background: 'rgba(55,71,255,0.06)',
  },
  navCta: {
    background: '#3747FF',
    color: '#fff', padding: '8px 18px',
    borderRadius: 40, fontWeight: 700,
    fontSize: '0.875rem', marginLeft: 6,
    letterSpacing: '-0.2px',
    transition: 'background 0.15s, transform 0.1s',
    boxShadow: '0 2px 12px rgba(55,71,255,0.28)',
  },
}
