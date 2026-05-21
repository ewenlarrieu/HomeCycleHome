import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../styles/ResetPassword.css'
import Button from '../components/Button'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (motDePasse !== confirmerMotDePasse) {
      return setError('Les mots de passe ne correspondent pas')
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, mot_de_passe: motDePasse, confirmer_mot_de_passe: confirmerMotDePasse }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
      } else {
        navigate('/login')
      }
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="reset-page">
        <h1 className="reset-title">Lien invalide</h1>
        <p className="reset-invalid">Ce lien de réinitialisation est invalide ou a expiré.</p>
        <Button label="Retour à la connexion" onClick={() => navigate('/login')} />
      </main>
    )
  }

  return (
    <main className="reset-page">
      <h1 className="reset-title">Nouveau mot de passe</h1>
      <form className="reset-container" onSubmit={handleSubmit} aria-label="Formulaire de nouveau mot de passe">
        <div className="reset-field">
          <label htmlFor="mot_de_passe" className="reset-label">Nouveau mot de passe</label>
          <input
            id="mot_de_passe"
            type="password"
            className="reset-input"
            placeholder="Au moins 8 caractères"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>
        <div className="reset-field">
          <label htmlFor="confirmer_mot_de_passe" className="reset-label">Confirmer le mot de passe</label>
          <input
            id="confirmer_mot_de_passe"
            type="password"
            className="reset-input"
            placeholder="Répétez le mot de passe"
            required
            value={confirmerMotDePasse}
            onChange={(e) => setConfirmerMotDePasse(e.target.value)}
          />
        </div>
        {error && <p className="reset-error">{error}</p>}
        <Button label={loading ? 'Enregistrement...' : 'Enregistrer'} type="submit" disabled={loading} />
      </form>
    </main>
  )
}
