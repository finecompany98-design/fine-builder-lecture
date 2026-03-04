import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'

const ADMIN_EMAIL = 'finecompany98@gmail.com'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = 아직 확인 중

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null))
    return unsub
  }, [])

  return {
    user,
    loading: user === undefined,
    isAdmin: user?.email === ADMIN_EMAIL,
  }
}
