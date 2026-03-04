import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { useState } from 'react'

export default function Auth() {
  const [user, setUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (e) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <main id="main" style={styles.main}>
      <div style={styles.card}>
        {user ? (
          <>
            <p style={styles.emoji}>👋</p>
            <h1 style={styles.title}>{user.displayName}님, 환영합니다!</h1>
            <p style={styles.sub}>{user.email}</p>
            <button onClick={handleSignOut} style={styles.btnOutline}>로그아웃</button>
          </>
        ) : (
          <>
            <p style={styles.emoji}>✦</p>
            <h1 style={styles.title}>fine:D에 오신 것을 환영합니다</h1>
            <p style={styles.sub}>로그인하면 AI 맞춤 추천과 북마크 기능을 사용할 수 있어요.</p>
            {error && <p style={styles.error}>{error}</p>}
            <button onClick={handleGoogleLogin} disabled={loading} style={styles.btnGoogle}>
              {loading ? '로그인 중...' : '🔵 Google로 시작하기'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}

const styles = {
  main: {
    padding: '80px 24px', display: 'flex',
    justifyContent: 'center', alignItems: 'center', minHeight: '70vh',
  },
  card: {
    background: 'rgba(26,26,26,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24, padding: '48px 40px',
    maxWidth: 440, width: '100%',
    textAlign: 'center',
  },
  emoji: { fontSize: '2.5rem', marginBottom: 16 },
  title: { fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 12 },
  sub: { color: 'rgba(240,235,248,0.6)', marginBottom: 32, lineHeight: 1.7 },
  error: { color: '#F87171', marginBottom: 16, fontSize: '0.9rem' },
  btnGoogle: {
    width: '100%', padding: '14px',
    background: '#fff', color: '#1a1a2e',
    borderRadius: 12, fontWeight: 700, fontSize: '1rem',
    fontFamily: 'inherit', cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnOutline: {
    padding: '12px 32px',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', borderRadius: 12,
    fontWeight: 600, fontFamily: 'inherit',
    cursor: 'pointer', transition: 'opacity 0.2s',
  },
}
