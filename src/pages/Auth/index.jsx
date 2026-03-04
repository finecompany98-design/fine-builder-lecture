import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ACCENT = '#3747FF'

/* 환경변수 — .env.local 에 추가:
   VITE_KAKAO_JS_KEY=your_kakao_javascript_key
   VITE_NAVER_CLIENT_ID=your_naver_client_id
   VITE_NAVER_CALLBACK_URL=https://your-domain.com/auth
*/
const KAKAO_KEY    = import.meta.env.VITE_KAKAO_JS_KEY
const NAVER_ID     = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_CB     = import.meta.env.VITE_NAVER_CALLBACK_URL ?? `${window.location.origin}/auth`

const PERKS = [
  { label: '활동 이력 기반 전담 매칭', desc: '이력을 등록하면 딱 맞는 공모를 자동으로 연결' },
  { label: '관심 공모 북마크', desc: '마음에 드는 공모를 저장하고 한눈에 관리' },
  { label: '마감 임박 알림', desc: '저장한 공모의 마감이 다가오면 먼저 알림' },
  { label: 'fine:D 맞춤 추천', desc: '분야·경력 기반으로 fine:D가 직접 추천' },
]

export default function Auth() {
  const [user, setUser]         = useState(auth.currentUser)
  const [loading, setLoading]   = useState(null) // 'google' | 'kakao' | 'naver'
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  /* Naver 콜백 처리 */
  useEffect(() => {
    if (!NAVER_ID) return
    const hash = window.location.hash
    if (!hash.includes('access_token')) return

    const params  = new URLSearchParams(hash.replace('#', '?'))
    const token   = params.get('access_token')
    const state   = params.get('state')
    const stored  = sessionStorage.getItem('naver_state')

    if (!token || state !== stored) return
    sessionStorage.removeItem('naver_state')
    window.history.replaceState({}, '', '/auth')

    // 네이버 프로필 요청 — 실제 운영에선 서버에서 처리 권장
    fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const p = data.response
        setUser({
          displayName: p.name ?? p.nickname ?? '네이버 사용자',
          email:       p.email ?? '',
          photoURL:    p.profile_image ?? null,
          provider:    'naver',
        })
      })
      .catch(() => setError('네이버 정보를 가져오지 못했습니다.'))
  }, [])

  /* Google 로그인 */
  const handleGoogle = async () => {
    setLoading('google'); setError('')
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      setUser(result.user)
    } catch {
      setError('Google 로그인 중 오류가 발생했습니다.')
    } finally { setLoading(null) }
  }

  /* 카카오 로그인 */
  const handleKakao = () => {
    if (!KAKAO_KEY) { setError('카카오 로그인 준비 중입니다. (관리자 문의)'); return }
    setLoading('kakao'); setError('')
    if (!window.Kakao?.isInitialized()) window.Kakao.init(KAKAO_KEY)

    window.Kakao.Auth.login({
      success() {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success(res) {
            const p = res.kakao_account?.profile ?? {}
            setUser({
              displayName: p.nickname ?? '카카오 사용자',
              email:       res.kakao_account?.email ?? '',
              photoURL:    p.profile_image_url ?? null,
              provider:    'kakao',
            })
            setLoading(null)
          },
          fail() { setError('카카오 정보를 가져오지 못했습니다.'); setLoading(null) },
        })
      },
      fail() { setError('카카오 로그인 중 오류가 발생했습니다.'); setLoading(null) },
    })
  }

  /* 네이버 로그인 */
  const handleNaver = () => {
    if (!NAVER_ID) { setError('네이버 로그인 준비 중입니다. (관리자 문의)'); return }
    const state = Math.random().toString(36).slice(2)
    sessionStorage.setItem('naver_state', state)
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=token`
      + `&client_id=${NAVER_ID}&redirect_uri=${encodeURIComponent(NAVER_CB)}&state=${state}`
    window.location.href = url
  }

  /* 로그아웃 */
  const handleSignOut = async () => {
    if (user?.provider === 'kakao' && window.Kakao?.Auth) {
      window.Kakao.Auth.logout()
    }
    if (!user?.provider) await signOut(auth)
    setUser(null)
  }

  /* ── 로그인 완료 상태 ── */
  if (user) {
    return (
      <main id="main" style={s.page}>
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
          {user.email && <p style={s.welcomeEmail}>{user.email}</p>}
          <div style={s.welcomeLinks}>
            <Link to="/competitions" style={s.welcomeBtn}>공모 둘러보기 →</Link>
            <Link to="/ai-recommend" style={s.welcomeBtnGhost}>맞춤 추천 받기</Link>
          </div>
          <button onClick={handleSignOut} style={s.signOutBtn}>로그아웃</button>
        </div>
      </main>
    )
  }

  /* ── 로그인 폼 ── */
  return (
    <main id="main" style={s.splitPage}>
      {/* 왼쪽 브랜드 */}
      <div style={s.leftPanel}>
        <div style={s.leftBgGrid} aria-hidden="true" />
        <div style={s.leftGlow} aria-hidden="true" />
        <div style={s.leftContent}>
          <Link to="/" style={s.brandLogo}>Fine<span style={{ color: ACCENT }}>:D</span></Link>
          <div style={s.leftMain}>
            <p style={s.leftEyebrow}>나만의 공모 비서</p>
            <h2 style={s.leftTitle}>예술가의<br />모든 기회를<br /><span style={{ color: ACCENT }}>한 곳에서</span></h2>
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

      {/* 오른쪽 로그인 */}
      <div style={s.rightPanel}>
        <div className="fade-up-1" style={s.loginCard}>
          <p style={s.loginEyebrow}>시작하기</p>
          <h1 style={s.loginTitle}>로그인</h1>
          <p style={s.loginSub}>
            소셜 계정으로 간편하게 시작하세요.<br />
            다음 계정은 카카오로 로그인하실 수 있어요.
          </p>

          {error && <p style={s.errorMsg}>{error}</p>}

          <div style={s.btnStack}>

            {/* Google */}
            <button onClick={handleGoogle} disabled={!!loading} style={{ ...s.socialBtn, ...s.btnGoogle }}>
              <span style={s.btnIcon}>
                {loading === 'google'
                  ? <span style={s.spinner} />
                  : <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.6 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20-7.8 20-21 0-1.4-.1-2.7-.5-4z"/>
                    </svg>
                }
              </span>
              <span style={{ color: '#3C3C3C' }}>Google 계정으로 로그인</span>
            </button>

            {/* Kakao */}
            <button onClick={handleKakao} disabled={!!loading} style={{ ...s.socialBtn, ...s.btnKakao }}>
              <span style={s.btnIcon}>
                {loading === 'kakao'
                  ? <span style={{ ...s.spinner, borderTopColor: '#3C1E1E' }} />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
                      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.7 4.3-2.8c.9.1 1.8.2 2.7.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
                    </svg>
                }
              </span>
              <span style={{ color: '#3C1E1E' }}>카카오 계정으로 로그인</span>
            </button>

            {/* Naver */}
            <button onClick={handleNaver} disabled={!!loading} style={{ ...s.socialBtn, ...s.btnNaver }}>
              <span style={s.btnIcon}>
                {loading === 'naver'
                  ? <span style={{ ...s.spinner, borderTopColor: '#fff' }} />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                      <path d="M13.64 12.47L10.17 7H7v10h3.36V11.53L14.83 17H18V7h-4.36z"/>
                    </svg>
                }
              </span>
              <span style={{ color: '#fff' }}>네이버 계정으로 로그인</span>
            </button>

          </div>

          <p style={s.loginNotice}>
            로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </main>
  )
}

/* ── 스타일 ── */
const s = {
  /* 로그인 완료 */
  page: {
    minHeight: '100vh', background: '#FAFAF9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px', position: 'relative',
  },
  glow: {
    position: 'absolute', top: '20%', left: '50%',
    transform: 'translateX(-50%)',
    width: 480, height: 480, borderRadius: '50%',
    background: `radial-gradient(circle, rgba(55,71,255,0.07) 0%, transparent 70%)`,
    filter: 'blur(40px)', pointerEvents: 'none',
  },
  welcomeCard: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 24, padding: '48px 44px',
    maxWidth: 420, width: '100%', textAlign: 'center',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)', position: 'relative',
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
    background: '#22C55E', border: '2px solid #fff',
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
    background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
    color: '#0D0D0D', fontWeight: 600, fontSize: '0.875rem',
  },
  signOutBtn: {
    fontSize: '13px', color: '#9A9A9A',
    fontFamily: 'inherit', cursor: 'pointer', padding: '6px 0',
  },

  /* 스플릿 */
  splitPage: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh', width: '100%',
  },
  leftPanel: {
    background: '#0A0A0A', padding: '48px 56px',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden',
  },
  leftBgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '28px 28px', pointerEvents: 'none',
  },
  leftGlow: {
    position: 'absolute', bottom: '-10%', right: '-10%',
    width: 400, height: 400, borderRadius: '50%',
    background: `radial-gradient(circle, rgba(55,71,255,0.18) 0%, transparent 70%)`,
    filter: 'blur(40px)', pointerEvents: 'none',
  },
  leftContent: {
    display: 'flex', flexDirection: 'column',
    height: '100%', position: 'relative', zIndex: 1,
  },
  brandLogo: {
    fontWeight: 900, fontSize: '1.3rem',
    color: '#fff', letterSpacing: '-0.5px', marginBottom: 'auto',
  },
  leftMain: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 32 },
  leftEyebrow: {
    fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20,
  },
  leftTitle: {
    fontSize: 'clamp(2rem, 3vw, 2.8rem)',
    fontWeight: 900, color: '#fff',
    letterSpacing: '-1.5px', lineHeight: 1.18, marginBottom: 44,
  },
  perkList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 },
  perkItem: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  perkDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: ACCENT, flexShrink: 0, marginTop: 6,
    boxShadow: `0 0 8px ${ACCENT}`,
  },
  perkLabel: { fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: 3 },
  perkDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 },
  leftFooter: { fontSize: '11px', color: 'rgba(255,255,255,0.2)' },

  /* 오른쪽 */
  rightPanel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 40px', background: '#fff',
  },
  loginCard: { width: '100%', maxWidth: 380 },
  loginEyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
  },
  loginTitle: {
    fontSize: '2rem', fontWeight: 900, color: '#0D0D0D',
    letterSpacing: '-1px', marginBottom: 12,
  },
  loginSub: { fontSize: '13px', color: '#8A8A8A', lineHeight: 1.8, marginBottom: 32 },
  errorMsg: {
    color: '#EF4444', fontSize: '13px',
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 10, padding: '10px 14px', marginBottom: 16,
  },

  /* 소셜 버튼들 */
  btnStack: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 },
  socialBtn: {
    width: '100%', padding: '13px 18px',
    display: 'flex', alignItems: 'center', gap: 14,
    borderRadius: 12, fontWeight: 700, fontSize: '0.875rem',
    fontFamily: 'inherit', cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
    border: 'none',
  },
  btnGoogle: {
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.12)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  btnKakao: { background: '#FEE500' },
  btnNaver: { background: '#03C75A' },
  btnIcon: {
    width: 20, height: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  spinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: '2px solid rgba(0,0,0,0.1)',
    borderTopColor: '#3747FF',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  loginNotice: {
    fontSize: '11px', color: '#B0B0B0', lineHeight: 1.7, textAlign: 'center',
  },
}
