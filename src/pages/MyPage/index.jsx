import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'

const ACCENT = '#3747FF'

const FIELD_OPTIONS   = ['시각예술', '공연예술', '문학·비평', '영상·미디어', '공예·디자인', '기타·융복합']
const STATUS_OPTIONS  = ['학생', '전업 작가', '겸업 작가', '예술 단체·법인']
const CAREER_OPTIONS  = ['데뷔 전', '3년 미만 · 신진', '3~10년 · 유망', '10년 이상 · 중견']
const REGION_OPTIONS  = ['서울', '경기·인천', '부산·경남', '대구·경북', '광주·전라', '대전·충청', '강원·제주', '지역 무관']

function loadProfile(uid) {
  try { return JSON.parse(localStorage.getItem(`fine_profile_${uid}`)) ?? {} } catch { return {} }
}
function saveProfile(uid, data) {
  localStorage.setItem(`fine_profile_${uid}`, JSON.stringify(data))
}

export default function MyPage() {
  const { user } = useAuth()
  const [tab, setTab]         = useState('profile')  // profile | history | bookmark
  const [profile, setProfile] = useState({})
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    if (user?.uid) setProfile(loadProfile(user.uid))
  }, [user?.uid])

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleToggleField = (v) => {
    const cur = profile.fields ?? []
    const next = cur.includes(v) ? cur.filter(f => f !== v) : [...cur, v]
    handleChange('fields', next)
  }

  const handleSave = () => {
    saveProfile(user.uid, profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleSignOut = async () => {
    await signOut(auth)
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <main id="main" style={s.page}>
      <div style={s.wrap}>

        {/* 사이드 프로필 카드 */}
        <aside style={s.sidebar}>
          <div style={s.profileCard}>
            <div style={s.avatarWrap}>
              {user.photoURL
                ? <img src={user.photoURL} alt="" style={s.avatar} referrerPolicy="no-referrer" />
                : <div style={s.avatarFallback}>{user.displayName?.[0] ?? '?'}</div>
              }
              <span style={s.onlineDot} />
            </div>
            <p style={s.profileName}>{user.displayName}</p>
            <p style={s.profileEmail}>{user.email}</p>
            {profile.fields?.length > 0 && (
              <div style={s.profileTags}>
                {profile.fields.slice(0, 2).map(f => (
                  <span key={f} style={s.profileTag}>{f}</span>
                ))}
                {profile.fields.length > 2 && (
                  <span style={s.profileTag}>+{profile.fields.length - 2}</span>
                )}
              </div>
            )}
          </div>

          {/* 탭 메뉴 */}
          <nav style={s.sideNav}>
            {[
              { key: 'profile',  label: '프로필' },
              { key: 'history',  label: '활동 이력' },
              { key: 'bookmark', label: '관심 공모' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{ ...s.sideNavBtn, ...(tab === key ? s.sideNavBtnActive : {}) }}
              >
                {label}
                {tab === key && <span style={s.sideNavIndicator} />}
              </button>
            ))}
          </nav>

          <button onClick={handleSignOut} style={s.signOutBtn}>로그아웃</button>
        </aside>

        {/* 메인 콘텐츠 */}
        <div style={s.content}>

          {/* ── 프로필 탭 ── */}
          {tab === 'profile' && (
            <section>
              <div style={s.contentHeader}>
                <div>
                  <p style={s.eyebrow}>My Profile</p>
                  <h2 style={s.contentTitle}>프로필</h2>
                </div>
                <button onClick={handleSave} style={{ ...s.saveBtn, background: saved ? '#22C55E' : ACCENT }}>
                  {saved ? '저장됨 ✓' : '저장하기'}
                </button>
              </div>

              <div style={s.formSection}>
                <label style={s.formLabel}>이름</label>
                <input
                  style={s.formInput}
                  value={profile.nickname ?? user.displayName ?? ''}
                  onChange={e => handleChange('nickname', e.target.value)}
                  placeholder="활동명 또는 닉네임"
                />
              </div>

              <div style={s.formSection}>
                <label style={s.formLabel}>한 줄 소개</label>
                <input
                  style={s.formInput}
                  value={profile.bio ?? ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  placeholder="예: 서울 기반 시각예술 작가"
                  maxLength={60}
                />
              </div>

              <div style={s.formSection}>
                <label style={s.formLabel}>포트폴리오 / SNS 링크</label>
                <input
                  style={s.formInput}
                  value={profile.link ?? ''}
                  onChange={e => handleChange('link', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div style={s.formSection}>
                <label style={s.formLabel}>알림 수신 이메일</label>
                <input
                  style={s.formInput}
                  value={profile.notifyEmail ?? user.email ?? ''}
                  onChange={e => handleChange('notifyEmail', e.target.value)}
                  placeholder="알림받을 이메일 주소"
                  type="email"
                />
              </div>
            </section>
          )}

          {/* ── 활동 이력 탭 ── */}
          {tab === 'history' && (
            <section>
              <div style={s.contentHeader}>
                <div>
                  <p style={s.eyebrow}>Activity History</p>
                  <h2 style={s.contentTitle}>활동 이력</h2>
                </div>
                <button onClick={handleSave} style={{ ...s.saveBtn, background: saved ? '#22C55E' : ACCENT }}>
                  {saved ? '저장됨 ✓' : '저장하기'}
                </button>
              </div>

              {/* 활동 분야 */}
              <div style={s.formSection}>
                <label style={s.formLabel}>활동 분야 <span style={s.labelSub}>중복 선택 가능</span></label>
                <div style={s.chipWrap}>
                  {FIELD_OPTIONS.map(v => {
                    const sel = (profile.fields ?? []).includes(v)
                    return (
                      <button key={v} onClick={() => handleToggleField(v)}
                        style={{ ...s.chip, ...(sel ? s.chipSel : {}) }}>
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 현재 신분 */}
              <div style={s.formSection}>
                <label style={s.formLabel}>현재 신분</label>
                <div style={s.chipWrap}>
                  {STATUS_OPTIONS.map(v => {
                    const sel = profile.status === v
                    return (
                      <button key={v} onClick={() => handleChange('status', v)}
                        style={{ ...s.chip, ...(sel ? s.chipSel : {}) }}>
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 경력 */}
              <div style={s.formSection}>
                <label style={s.formLabel}>활동 경력</label>
                <div style={s.chipWrap}>
                  {CAREER_OPTIONS.map(v => {
                    const sel = profile.career === v
                    return (
                      <button key={v} onClick={() => handleChange('career', v)}
                        style={{ ...s.chip, ...(sel ? s.chipSel : {}) }}>
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 예술활동증명 */}
              <div style={s.formSection}>
                <label style={s.formLabel}>예술활동증명</label>
                <div style={s.chipWrap}>
                  {[
                    { v: 'yes', label: '있어요' },
                    { v: 'no',  label: '아직 없어요' },
                  ].map(({ v, label }) => {
                    const sel = profile.certificate === v
                    return (
                      <button key={v} onClick={() => handleChange('certificate', v)}
                        style={{ ...s.chip, ...(sel ? s.chipSel : {}) }}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 주요 활동 지역 */}
              <div style={s.formSection}>
                <label style={s.formLabel}>주요 활동 지역</label>
                <div style={s.chipWrap}>
                  {REGION_OPTIONS.map(v => {
                    const sel = profile.region === v
                    return (
                      <button key={v} onClick={() => handleChange('region', v)}
                        style={{ ...s.chip, ...(sel ? s.chipSel : {}) }}>
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 이력 등록 안내 */}
              <div style={s.infoBox}>
                <p style={s.infoText}>
                  ◎ 활동 이력을 등록하면 fine:D가 새 공모를 자동으로 매칭해드립니다.
                </p>
              </div>
            </section>
          )}

          {/* ── 관심 공모 탭 ── */}
          {tab === 'bookmark' && (
            <section>
              <div style={s.contentHeader}>
                <div>
                  <p style={s.eyebrow}>Bookmarks</p>
                  <h2 style={s.contentTitle}>관심 공모</h2>
                </div>
              </div>

              <div style={s.emptyState}>
                <p style={s.emptyIcon}>◎</p>
                <p style={s.emptyTitle}>아직 저장한 공모가 없어요</p>
                <p style={s.emptyDesc}>
                  공모·지원사업 목록에서 마음에 드는 공모를 북마크하면<br />
                  여기에 모아서 볼 수 있어요
                </p>
                <Link to="/competitions" style={s.emptyBtn}>공모 둘러보기 →</Link>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#FAFAF9',
    padding: '40px 28px 80px',
  },
  wrap: {
    maxWidth: 1000, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: 32, alignItems: 'flex-start',
  },

  /* 사이드바 */
  sidebar: { display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 88 },
  profileCard: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 18, padding: '28px 20px',
    textAlign: 'center',
  },
  avatarWrap: { position: 'relative', display: 'inline-block', marginBottom: 14 },
  avatar: { width: 64, height: 64, borderRadius: '50%', display: 'block' },
  avatarFallback: {
    width: 64, height: 64, borderRadius: '50%',
    background: ACCENT, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem', fontWeight: 900,
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: '50%',
    background: '#22C55E', border: '2px solid #fff',
  },
  profileName: { fontSize: '0.95rem', fontWeight: 800, color: '#0D0D0D', marginBottom: 4 },
  profileEmail: { fontSize: '11px', color: '#9A9A9A', marginBottom: 12 },
  profileTags: { display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' },
  profileTag: {
    fontSize: '10px', fontWeight: 600,
    background: 'rgba(55,71,255,0.08)', color: ACCENT,
    border: '1px solid rgba(55,71,255,0.15)',
    padding: '2px 8px', borderRadius: 20,
  },

  sideNav: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 14, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
  },
  sideNavBtn: {
    padding: '13px 18px', textAlign: 'left',
    fontSize: '0.875rem', fontWeight: 500, color: '#6A6A6A',
    fontFamily: 'inherit', cursor: 'pointer',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    position: 'relative', transition: 'all 0.15s',
  },
  sideNavBtnActive: { color: '#0D0D0D', fontWeight: 700, background: '#FAFAF9' },
  sideNavIndicator: {
    position: 'absolute', left: 0, top: '20%',
    width: 3, height: '60%', borderRadius: 3,
    background: ACCENT,
  },
  signOutBtn: {
    padding: '10px', borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#fff', color: '#9A9A9A',
    fontSize: '13px', fontFamily: 'inherit',
    cursor: 'pointer', transition: 'all 0.15s',
  },

  /* 메인 콘텐츠 */
  content: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 18, padding: '36px 32px',
  },
  contentHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 36,
  },
  eyebrow: {
    fontSize: '11px', fontWeight: 700, color: ACCENT,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
  },
  contentTitle: {
    fontSize: '1.5rem', fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.5px',
  },
  saveBtn: {
    padding: '9px 20px', borderRadius: 40,
    color: '#fff', fontWeight: 700, fontSize: '0.875rem',
    fontFamily: 'inherit', cursor: 'pointer', border: 'none',
    transition: 'background 0.2s',
  },

  /* 폼 */
  formSection: { marginBottom: 28 },
  formLabel: {
    display: 'block', fontSize: '13px', fontWeight: 700,
    color: '#3A3A3A', marginBottom: 10,
  },
  labelSub: { fontSize: '11px', fontWeight: 400, color: '#9A9A9A', marginLeft: 6 },
  formInput: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10,
    fontSize: '0.875rem', fontFamily: 'inherit', color: '#0D0D0D',
    background: '#FAFAF9', outline: 'none',
    transition: 'border-color 0.15s',
  },

  /* 칩 선택 */
  chipWrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '8px 16px', borderRadius: 40,
    border: '1.5px solid rgba(0,0,0,0.1)',
    background: '#fff', color: '#5A5A5A',
    fontSize: '0.845rem', fontWeight: 600,
    fontFamily: 'inherit', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  chipSel: {
    background: ACCENT, borderColor: ACCENT, color: '#fff',
  },

  /* 안내 박스 */
  infoBox: {
    background: 'rgba(55,71,255,0.05)',
    border: '1px solid rgba(55,71,255,0.12)',
    borderRadius: 12, padding: '14px 18px',
    marginTop: 8,
  },
  infoText: { fontSize: '13px', color: ACCENT, lineHeight: 1.7 },

  /* 빈 상태 */
  emptyState: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: '2rem', color: ACCENT, marginBottom: 16 },
  emptyTitle: { fontSize: '1rem', fontWeight: 800, color: '#0D0D0D', marginBottom: 10 },
  emptyDesc: { fontSize: '13px', color: '#8A8A8A', lineHeight: 1.8, marginBottom: 24 },
  emptyBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '10px 22px', borderRadius: 40,
    background: ACCENT, color: '#fff',
    fontWeight: 700, fontSize: '0.875rem',
    boxShadow: '0 4px 16px rgba(55,71,255,0.25)',
  },
}
