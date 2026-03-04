import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ACCENT = '#3747FF'

const PERKS = [
  { label: '활동 이력 기반 전담 매칭', desc: '이력을 등록하면 딱 맞는 공모를 자동으로 연결' },
  { label: '관심 공모 북마크', desc: '마음에 드는 공모를 저장하고 한눈에 관리' },
  { label: '마감 임박 알림', desc: '저장한 공모의 마감이 다가오면 먼저 알림' },
  { label: 'fine:D 맞춤 추천', desc: '분야·경력 기반으로 fine:D가 직접 추천' },
]

export default function Auth() {
  const [user, setUser]     = useState(auth.currentUser)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      setUser(result.user)
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    setUser(null)
  }

  /* ── 로그인 완료 상태 ── */
  if (user) {
    return (
      <main id="main" style={s.page}>
        <div style={s.welcomeWrap}>
          {/* 배경 글로우 */}
          <div style={s.glow} aria-hidden="true" />

          <div className="fade-up-1" style={s.welcomeCard}>
            <div style={s.avatarWrap}>
              {user.photoURL
                ? <img src={user.photoURL} alt="" style={s.avatar} referrerPolicy="no-referrer" />
                : <div style={s.avatarFallback}>{user.displayName?.[0] ?? '?'}</div>
              }
              <span style={s.onlineDot} />
            </div>
            <p style={s.welcomeEyebrow}>반갑습니다</p>
            <h1 style={s.welcomeName}>{user.displayName}<span style={{ color: ACCENT }}>님</span></h1>
            <p style={s.welcomeEmail}>{user.email}</p>

            <div style={s.welcomeLinks}>
              <Link to="/competitions" style={s.welcomeBtn}>공모 둘러보기 →</Link>
              <Link to="/ai-recommend" style={s.welcomeBtnGhost}>맞춤 추천 받기</Link>
            </div>

            <button onClick={handleSignOut} style={s.signOutBtn}>로그아웃</button>
          </div>
        </div>
      </main>
    )
  }

  /* ── 로그인 폼 ── */
  return (
    <main id="main" style={s.page}>
      <div style={s.splitWrap}>

        {/* 왼쪽: 브랜드 패널 */}
        <div style={s.leftPanel}>
          <div style={s.leftBgGrid} aria-hidden="true" />
          <div style={s.leftGlow} aria-hidden="true" />

          <div style={s.leftContent}>
            <Link to="/" style={s.brandLogo}>
              Fine<span style={{ color: ACCENT }}>:D</span>
            </Link>

            <div style={s.leftMain}>
              <p style={s.leftEyebrow}>나만의 공모 비서</p>
              <h2 style={s.leftTitle}>
                예술가의<br />
                모든 기회를<br />
                <span style={{ color: ACCENT }}>한 곳에서</span>
              </h2>

              <ul style={s.perkList}>
                {PERKS.map(({ label, desc }) => (
                  <li key={label} style={s.perkItem}>
                    <span style={s.perkDot} aria-hidden="true" />
                    <div>
                      <p style={s.perkLabel}>{label}</p>
                      <p style={s.perkDesc}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p style={s.leftFooter}>© 2025 fine:D</p>
          </div>
        </div>

        {/* 오른쪽: 로그인 카드 */}
        <div style={s.rightPanel}>
          <div className="fade-up-1" style={s.loginCard}>
            <div style={s.loginCardTop}>
              <p style={s.loginEyebrow}>시작하기</p>
              <h1 style={s.loginTitle}>로그인</h1>
              <p style={s.loginSub}>
                로그인하면 맞춤 추천, 북마크,<br />마감 알림 등 모든 기능을 사용할 수 있어요.
              </p>
            </div>

            {error && <p style={s.errorMsg}>{error}</p>}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ ...s.googleBtn, opacity: loading ? 0.6 : 1 }}
            >
              {/* Google 아이콘 SVG */}
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.6 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20-7.8 20-21 0-1.4-.1-2.7-.5-4z"/>
                  <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.1-17.7 10.2-.1.1 0 1.5 0 1.5z"/>
                  <path fill="#FBBC05" d="M24 45c5.5 0 10.4-1.9 14.2-5l-6.5-5.5C29.6 36 27 37 24 37c-5.6 0-10.3-3.4-11.7-8.5l-7 5.4C8.3 40.9 15.5 45 24 45z"/>
                  <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.6 2.6-2.1 4.8-4.1 6.4l6.5 5.5C42.1 36.9 45 31 45 24c0-1.4-.1-2.7-.5-4z"/>
                </svg>
              )}
              <span>{loading ? '로그인 중...' : 'Google 계정으로 로그인'}</span>
            </button>

            <div style={s.divider}>
              <span style={s.dividerLine} />
              <span style={s.dividerText}>fine:D는 Google 계정만 지원합니다</span>
              <span style={s.dividerLine} />
            </div>

            <p style={s.loginNotice}>
              로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#FAFAF9',
    display: 'flex',
    alignItems: 'stretch',
  },

  /* ── 스플릿 레이아웃 ── */
  splitWrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: '100%',
    minHeight: '100vh',
  },

  /* 왼쪽 브랜드 패널 */
  leftPanel: {
    background: '#0A0A0A',
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
  },
  leftGlow: {
    position: 'absolute', bottom: '-10%', right: '-10%',
    width: 400, height: 400, borderRadius: '50%',
    background: `radial-gradient(circle, rgba(55,71,255,0.18) 0%, transparent 70%)`,
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  leftContent: {
    display: 'flex', flexDirection: 'column',
    height: '100%', position: 'relative', zIndex: 1,
  },
  brandLogo: {
    fontWeight: 900, fontSize: '1.3rem',
    color: '#fff', letterSpacing: '-0.5px',
    marginBottom: 'auto',
  },
  leftMain: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 32 },
  leftEyebrow: {
    fontSize: '11px', fontWeight: 700,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: 20,
  },
  leftTitle: {
    fontSize: 'clamp(2rem, 3vw, 2.8rem)',
    fontWeight: 900, color: '#fff',
    letterSpacing: '-1.5px', lineHeight: 1.18,
    marginBottom: 44,
  },
  perkList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 },
  perkItem: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  perkDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: ACCENT, flexShrink: 0,
    marginTop: 6,
    boxShadow: `0 0 8px ${ACCENT}`,
  },
  perkLabel: { fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 3 },
  perkDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 },
  leftFooter: { fontSize: '11px', color: 'rgba(255,255,255,0.2)' },

  /* 오른쪽 로그인 카드 */
  rightPanel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 40px', background: '#fff',
  },
  loginCard: {
    width: '100%', maxWidth: 400,
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  loginCardTop: { marginBottom: 36 },
  loginEyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: 12,
  },
  loginTitle: {
    fontSize: '2rem', fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', marginBottom: 14,
  },
  loginSub: {
    fontSize: '14px', color: '#8A8A8A', lineHeight: 1.8,
  },
  errorMsg: {
    color: '#EF4444', fontSize: '13px',
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 10, padding: '10px 14px',
    marginBottom: 16,
  },
  googleBtn: {
    width: '100%', padding: '14px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    background: '#fff', color: '#0D0D0D',
    border: '1.5px solid rgba(0,0,0,0.14)',
    borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
    fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    transition: 'box-shadow 0.15s, transform 0.1s',
    marginBottom: 24,
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1, height: 1,
    background: 'rgba(0,0,0,0.08)',
  },
  dividerText: {
    fontSize: '11px', color: '#B0B0B0',
    whiteSpace: 'nowrap', fontWeight: 500,
  },
  loginNotice: {
    fontSize: '11px', color: '#B0B0B0', lineHeight: 1.7, textAlign: 'center',
  },

  /* ── 로그인 완료 ── */
  welcomeWrap: {
    flex: 1, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px',
    position: 'relative',
  },
  glow: {
    position: 'absolute', top: '20%', left: '50%',
    transform: 'translateX(-50%)',
    width: 500, height: 500, borderRadius: '50%',
    background: `radial-gradient(circle, rgba(55,71,255,0.07) 0%, transparent 70%)`,
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  welcomeCard: {
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 24, padding: '48px 44px',
    maxWidth: 420, width: '100%',
    textAlign: 'center',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    position: 'relative',
  },
  avatarWrap: { position: 'relative', display: 'inline-block', marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: '50%', display: 'block' },
  avatarFallback: {
    width: 72, height: 72, borderRadius: '50%',
    background: ACCENT, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8rem', fontWeight: 900,
  },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: '50%',
    background: '#22C55E',
    border: '2px solid #fff',
  },
  welcomeEyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
  },
  welcomeName: {
    fontSize: '1.8rem', fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', marginBottom: 6,
  },
  welcomeEmail: { fontSize: '13px', color: '#9A9A9A', marginBottom: 32 },
  welcomeLinks: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  welcomeBtn: {
    padding: '11px 22px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.875rem',
    boxShadow: `0 4px 16px rgba(55,71,255,0.25)`,
  },
  welcomeBtnGhost: {
    padding: '11px 22px', borderRadius: 40,
    background: 'transparent',
    border: '1.5px solid rgba(0,0,0,0.12)',
    color: '#0D0D0D', fontWeight: 600, fontSize: '0.875rem',
  },
  signOutBtn: {
    fontSize: '13px', color: '#9A9A9A',
    fontFamily: 'inherit', cursor: 'pointer',
    padding: '6px 0',
  },
}
