import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={s.footer} role="contentinfo">
      <div style={s.inner}>
        <div style={s.top}>
          <div style={s.brand}>
            <p style={s.logo}>
              Fine<span style={s.logoAccent}>:D</span>
            </p>
            <p style={s.tagline}>예술인의 기회를 fine:D에서 찾아요</p>
          </div>
          <nav style={s.links} aria-label="서비스 메뉴">
            <strong style={s.colTitle}>서비스</strong>
            <Link to="/competitions" style={s.link}>공모·지원사업</Link>
            <Link to="/ai-recommend" style={s.link}>AI 맞춤 추천</Link>
          </nav>
          <nav style={s.links} aria-label="정보 메뉴">
            <strong style={s.colTitle}>정보</strong>
            <Link to="/auth" style={s.link}>로그인·회원가입</Link>
          </nav>
        </div>
        <div style={s.bottom}>
          <p style={s.copy}>© 2025 fine:D · 예술인의 기회를 한 곳에서</p>
          <span style={s.accentDot} aria-hidden="true" />
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    background: '#0A0A0A',
    padding: '52px 28px 32px',
  },
  inner: { maxWidth: 1100, margin: '0 auto' },
  top: {
    display: 'flex', gap: 64, flexWrap: 'wrap',
    paddingBottom: 36,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: 24,
  },
  brand: { flex: '1 1 160px' },
  logo: {
    fontWeight: 900, fontSize: '1.15rem',
    color: '#fff', marginBottom: 8,
    letterSpacing: '-0.5px',
  },
  logoAccent: { color: '#FF4D1C' },
  tagline: { color: 'rgba(255,255,255,0.3)', fontSize: '12px', lineHeight: 1.6 },
  links: { display: 'flex', flexDirection: 'column', gap: 10 },
  colTitle: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: 6,
  },
  link: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: '13px', transition: 'color 0.2s',
  },
  bottom: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: { color: 'rgba(255,255,255,0.18)', fontSize: '11px' },
  accentDot: {
    display: 'inline-block',
    width: 6, height: 6, borderRadius: '50%',
    background: '#FF4D1C',
    boxShadow: '0 0 8px rgba(255,77,28,0.6)',
  },
}
