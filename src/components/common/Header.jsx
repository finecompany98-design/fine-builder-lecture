import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

/* ── FE 로고 DNA 계승 Fine:D 전용 아이콘 ── */
function LogoIcon() {
  return (
    <svg
      width="26" height="26"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── 블랙: FE 로고 직선 DNA ── */}
      {/* 왼쪽 수직선 (F+E 공유, 풀 높이) */}
      <line x1="5" y1="3" x2="5" y2="41" stroke="#0D0D0D" strokeWidth="4.2" strokeLinecap="square"/>
      {/* 상단 수평선 */}
      <line x1="5" y1="3" x2="28" y2="3" stroke="#0D0D0D" strokeWidth="4.2" strokeLinecap="square"/>
      {/* 중간 가로 바 (F 크로스바) */}
      <line x1="5" y1="22" x2="23" y2="22" stroke="#0D0D0D" strokeWidth="4.2" strokeLinecap="square"/>
      {/* 대각선 — FE 로고 핵심 DNA */}
      <line x1="23" y1="22" x2="31" y2="38" stroke="#0D0D0D" strokeWidth="4.2" strokeLinecap="square"/>

      {/* ── 포인트 컬러 #3747FF: 새로 추가된 ':D' ── */}
      {/* 콜론 점 두 개 ':' */}
      <circle cx="34" cy="8"  r="2.6" fill="#3747FF"/>
      <circle cx="34" cy="16" r="2.6" fill="#3747FF"/>
      {/* 'D' 아크 — 웃는 얼굴 / Find 느낌 */}
      <path
        d="M28 24 Q39 31 28 39"
        stroke="#3747FF" strokeWidth="3.8" strokeLinecap="round" fill="none"
      />
    </svg>
  )
}

export default function Header() {
  const location = useLocation()
  const [fontSize, setFontSize] = useState('normal')
  const { user, isAdmin } = useAuth()

  const handleFont = (size) => {
    setFontSize(size)
    document.documentElement.className = document.documentElement.className
      .replace(/font-\w+/g, '')
    document.documentElement.classList.add(`font-${size}`)
  }

  const navLinks = [
    { to: '/competitions', label: '공모·지원사업' },
    { to: '/ai-recommend', label: '맞춤 추천' },
  ]

  return (
    <header style={s.header} role="banner">
      <div className="header-inner" style={s.inner}>

        <Link to="/" className="logo-wrap" style={s.logo} aria-label="fine:D 홈으로 이동">
          <LogoIcon />
          <span className="logo-fine" style={s.logoText}>Fine</span>
          <span className="logo-accent" style={s.logoAccent}>:D</span>
        </Link>

        <div role="group" aria-label="글자 크기 조절" className="header-font-controls" style={s.fontControls}>
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
          {navLinks.map(({ to, label }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link key={to} to={to} className="header-nav-link" style={{
                ...s.navLink,
                color: active ? '#0D0D0D' : '#6A6A6A',
                fontWeight: active ? 600 : 400,
                background: active ? '#ECECEA' : 'transparent',
              }}>
                {label}
              </Link>
            )
          })}

          {isAdmin && (
            <Link to="/admin" className="header-admin-btn" style={s.adminBtn}>＋ 등록</Link>
          )}

          {user ? (
            <Link to="/mypage" style={s.avatarBtn} aria-label="마이페이지">
              {user.photoURL ? (
                <img src={user.photoURL} alt="프로필" style={s.avatarImg} />
              ) : (
                <span style={s.avatarFallback}>
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <Link to="/auth" className="header-nav-cta" style={s.navCta}>로그인</Link>
          )}
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
    /* layout은 Header.css .header-inner 에서 관리 */
    padding: '0 28px',
  },
  logo: {
    marginRight: 'auto',
  },
  logoText: {},   /* .logo-fine 클래스가 처리 */
  logoAccent: {}, /* .logo-accent 클래스가 처리 */
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
    padding: '7px 14px', borderRadius: 8,
    fontSize: '0.82rem', transition: 'all 0.15s',
    letterSpacing: '0px',
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
  avatarBtn: {
    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
    overflow: 'hidden', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 6, flexShrink: 0,
    border: '2px solid #3747FF',
    transition: 'box-shadow 0.15s',
    boxShadow: '0 0 0 0px rgba(55,71,255,0.3)',
  },
  avatarImg: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%', height: '100%',
    background: '#3747FF', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.9rem',
  },
}
