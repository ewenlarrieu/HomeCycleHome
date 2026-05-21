import { useState } from 'react'
import '../styles/ForgotPassword.css'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
      } else {
        setMessage(data.message)
      }
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="forgot-page">
      <div className="forgot-back">
        <Button label="Retour" onClick={() => navigate('/login')} />
      </div>
      <h1 className="forgot-title">Mot de passe oublié</h1>
      <form className="forgot-container" onSubmit={handleSubmit} aria-label="Formulaire de réinitialisation du mot de passe">
        <div className="forgot-field">
          <label htmlFor="email" className="forgot-label">Email</label>
          <input
            id="email"
            type="email"
            className="forgot-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="forgot-error">{error}</p>}
        {message && <p className="forgot-success">{message}</p>}
        <Button label={loading ? 'Envoi...' : 'Suivant'} type="submit" disabled={loading} />
      </form>
    </main>
  )
}
