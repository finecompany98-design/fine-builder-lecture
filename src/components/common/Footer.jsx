import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={s.footer} role="contentinfo">
      <div style={s.inner}>
        <div style={s.top}>
          <div>
            <p style={s.logo}>fine<span style={{color:'#8B5CF6'}}>:D</span></p>
            <p style={s.tagline}>예술인의 기회를 fine:D에서 찾아요</p>
          </div>
          <nav style={s.links} aria-label="하단 메뉴">
            <strong style={s.colTitle}>서비스</strong>
            <Link to="/competitions" style={s.link}>공모·지원사업</Link>
            <Link to="/ai-recommend" style={s.link}>AI 맞춤 추천</Link>
          </nav>
          <nav style={s.links} aria-label="정보">
            <strong style={s.colTitle}>정보</strong>
            <Link to="/auth" style={s.link}>로그인·회원가입</Link>
          </nav>
        </div>
        <div style={s.bottom}>
          <p style={s.copy}>© 2025 fine:D · 예술인의 기회를 한 곳에서</p>
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    background: '#1A1027',
    padding: '48px 24px 32px',
    marginTop: 0,
  },
  inner: { maxWidth: 1100, margin: '0 auto' },
  top: {
    display: 'flex', gap: 60, flexWrap: 'wrap',
    paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 24,
  },
  logo: { fontWeight: 900, fontSize: '1.2rem', color: '#8B5CF6', marginBottom: 8 },
  tagline: { color: 'rgba(240,235,248,0.5)', fontSize: '0.85rem' },
  links: { display: 'flex', flexDirection: 'column', gap: 10 },
  colTitle: { color: 'rgba(240,235,248,0.35)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 },
  link: { color: 'rgba(240,235,248,0.6)', fontSize: '0.88rem', transition: 'color 0.2s' },
  bottom: { textAlign: 'center' },
  copy: { color: 'rgba(240,235,248,0.3)', fontSize: '0.82rem' },
}
