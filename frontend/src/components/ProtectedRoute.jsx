import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

export default function ProtectedRoute({ role }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(user => {
        if (role && user.role.libelle !== role) {
          setStatus('forbidden')
        } else {
          setStatus('ok')
        }
      })
      .catch(() => setStatus('unauthorized'))
  }, [role])

  if (status === 'loading') return null
  if (status === 'ok') return <Outlet />
  return <Navigate to="/login" replace />
}
