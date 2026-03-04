import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={s.loading}>
        <span style={s.dot} />
        <span style={s.dot} />
        <span style={s.dot} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return children
}

const s = {
  loading: {
    minHeight: '60vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#3747FF', display: 'inline-block',
    animation: 'fadeUp 0.6s ease infinite alternate',
  },
}
