import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer} role="contentinfo">
      <div style={styles.inner}>
        <p style={styles.logo}>✦ 모두의 예술</p>
        <p style={styles.copy}>문화예술을 모두에게 · © 2025 모두의 예술</p>
        <nav style={styles.nav} aria-label="하단 메뉴">
          <Link to="/terms" style={styles.link}>이용약관</Link>
          <Link to="/privacy" style={styles.link}>개인정보처리방침</Link>
          <Link to="/contact" style={styles.link}>문의하기</Link>
        </nav>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '32px 24px',
    marginTop: 80,
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 12, textAlign: 'center',
  },
  logo: { fontWeight: 900, fontSize: '1.2rem', color: '#8B5CF6' },
  copy: { color: 'rgba(240,235,248,0.5)', fontSize: '0.85rem' },
  nav: { display: 'flex', gap: 24 },
  link: { color: 'rgba(240,235,248,0.5)', fontSize: '0.85rem', transition: 'color 0.2s' },
}
