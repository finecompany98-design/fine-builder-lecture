import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition } from '../../services/competitions.service'
import './CompetitionDetail.css'

function fmtDate(ts) {
  if (!ts) return '미정'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function dday(deadline) {
  if (!deadline) return null
  const end = deadline.toDate ? deadline.toDate() : new Date(deadline)
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0)  return { label: '마감',   type: 'closed' }
  if (diff === 0) return { label: 'D-DAY',  type: 'today'  }
  if (diff <= 7)  return { label: `D-${diff}`, type: 'urgent' }
  return           { label: `D-${diff}`, type: 'normal' }
}

export default function CompetitionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getCompetition(id)
        if (!data) {
          setError('해당 공모를 찾을 수 없습니다.')
        } else {
          setItem(data)
        }
      } catch (e) {
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <DetailSkeleton />
  if (error) return (
    <main className="detail-page">
      <div className="detail-container">
        <div className="detail-error">
          <p>{error}</p>
          <button onClick={() => navigate('/competitions')}>목록으로 돌아가기</button>
        </div>
      </div>
    </main>
  )

  const dd = dday(item.deadline)
  const isSupport = item.type === '지원사업'
  const elig = item.eligibility || {}

  return (
    <main className="detail-page">
      {/* Hero banner */}
      <section className="detail-hero">
        <div className="detail-hero-inner">
          <button className="detail-back" onClick={() => navigate('/competitions')}>
            <span className="detail-back-arrow">←</span>
            목록
          </button>

          <div className="detail-hero-content">
            <div className="detail-hero-badges">
              <span className={`detail-type-badge ${isSupport ? 'is-green' : 'is-blue'}`}>
                {item.type}
              </span>
              <span className="detail-cat-badge">{item.category}</span>
              {dd && <span className={`detail-dday is-${dd.type}`}>{dd.label}</span>}
            </div>
            <h1 className="detail-title">{item.title}</h1>
            <p className="detail-org">{item.organization}</p>
          </div>
        </div>
        <span className="detail-hero-bg" aria-hidden="true">DETAIL</span>
      </section>

      {/* Body */}
      <div className="detail-container">
        <div className="detail-body">

          {/* Left: main info */}
          <div className="detail-main">

            {/* 기본 정보 */}
            <section className="detail-section">
              <h2 className="detail-section-title">기본 정보</h2>
              <div className="detail-info-grid">
                <InfoRow label="주최/주관" value={item.organization} />
                <InfoRow label="지원금액" value={item.amount} accent />
                <InfoRow label="마감일" value={fmtDate(item.deadline)} />
                {item.startDate && <InfoRow label="접수 시작일" value={fmtDate(item.startDate)} />}
                <InfoRow label="지역" value={item.region} />
                {item.targetGroup?.length > 0 && (
                  <InfoRow label="대상" value={item.targetGroup.join(', ')} />
                )}
              </div>
            </section>

            {/* 설명 */}
            {item.description && (
              <section className="detail-section">
                <h2 className="detail-section-title">사업 개요</h2>
                <p className="detail-description">{item.description}</p>
              </section>
            )}

            {/* 자격요건 (eligibility) */}
            {Object.keys(elig).length > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">자격요건</h2>
                <div className="detail-info-grid">
                  {elig.age && <InfoRow label="나이" value={elig.age} />}
                  {elig.region && <InfoRow label="지역" value={elig.region} />}
                  {elig.career && <InfoRow label="경력" value={elig.career} />}
                  {elig.entityType && <InfoRow label="대상 유형" value={elig.entityType} />}
                  {elig.hasBusiness !== undefined && (
                    <InfoRow label="사업자등록" value={elig.hasBusiness ? '필요' : '불필요'} />
                  )}
                  {elig.other && <InfoRow label="기타" value={elig.other} />}
                </div>
              </section>
            )}

            {/* 제출서류 (documents) */}
            {item.documents?.length > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">제출서류</h2>
                <ul className="detail-doc-list">
                  {item.documents.map((doc, i) => (
                    <li key={i} className="detail-doc-item">
                      <span className="detail-doc-bullet" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 첨부파일 (attachments) */}
            {item.attachments?.length > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">첨부파일</h2>
                <div className="detail-attach-list">
                  {item.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-attach-item"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="detail-attach-icon">
                        <path d="M10 3v10m0 0l-3-3m3 3l3-3M4 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {att.name}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="detail-aside">

            {/* CTA */}
            {item.orgUrl && (
              <a
                href={item.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-cta"
              >
                공식 사이트에서 신청
                <span className="detail-cta-arrow">→</span>
              </a>
            )}

            {/* 지원형태 (supportType) */}
            {item.supportType?.length > 0 && (
              <div className="detail-aside-card">
                <h3 className="detail-aside-label">지원형태</h3>
                <div className="detail-chip-list">
                  {item.supportType.map((st, i) => (
                    <span key={i} className="detail-chip is-support">{st}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 분야 (fields) */}
            {item.fields?.length > 0 && (
              <div className="detail-aside-card">
                <h3 className="detail-aside-label">분야</h3>
                <div className="detail-chip-list">
                  {item.fields.map((f, i) => (
                    <span key={i} className="detail-chip is-field">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 토픽 태그 (tags) */}
            {item.tags?.length > 0 && (
              <div className="detail-aside-card">
                <h3 className="detail-aside-label">토픽</h3>
                <div className="detail-chip-list">
                  {item.tags.map((t, i) => (
                    <span key={i} className="detail-chip is-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 출처 */}
            {item.source && (
              <div className="detail-aside-card">
                <h3 className="detail-aside-label">출처</h3>
                <p className="detail-aside-source">{item.source}</p>
              </div>
            )}
          </aside>

        </div>
      </div>
    </main>
  )
}

function InfoRow({ label, value, accent }) {
  if (!value) return null
  return (
    <div className="detail-info-row">
      <span className="detail-info-label">{label}</span>
      <span className={`detail-info-value${accent ? ' is-accent' : ''}`}>{value}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <main className="detail-page">
      <section className="detail-hero">
        <div className="detail-hero-inner">
          <div style={{ height: 18, width: 60, background: 'rgba(255,255,255,0.1)', borderRadius: 6 }} />
          <div className="detail-hero-content">
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ height: 22, width: 60, background: 'rgba(255,255,255,0.08)', borderRadius: 20 }} />
              <div style={{ height: 22, width: 50, background: 'rgba(255,255,255,0.08)', borderRadius: 20 }} />
            </div>
            <div style={{ height: 32, width: '70%', background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginTop: 16 }} />
            <div style={{ height: 14, width: '30%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginTop: 12 }} />
          </div>
        </div>
      </section>
      <div className="detail-container">
        <div className="detail-body">
          <div className="detail-main">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="detail-section">
                <div style={{ height: 16, width: 100, background: '#eee', borderRadius: 6, marginBottom: 16 }} />
                <div style={{ height: 12, width: '90%', background: '#f3f3f1', borderRadius: 6, marginBottom: 10 }} />
                <div style={{ height: 12, width: '70%', background: '#f3f3f1', borderRadius: 6 }} />
              </div>
            ))}
          </div>
          <aside className="detail-aside">
            <div style={{ height: 48, background: '#eee', borderRadius: 12 }} />
          </aside>
        </div>
      </div>
    </main>
  )
}
