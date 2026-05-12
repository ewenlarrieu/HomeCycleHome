import '../styles/ForgotPassword.css'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <main className="forgot-page">
      <div className="forgot-back">
        <Button label="Retour" onClick={() => navigate('/login')} />
      </div>
      <h1 className="forgot-title">Mot de passe oublié</h1>
      <form className="forgot-container" aria-label="Formulaire de réinitialisation du mot de passe">
        <div className="forgot-field">
          <label htmlFor="email" className="forgot-label">Email</label>
          <input
            id="email"
            type="email"
            className="forgot-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
          />
        </div>
        <Button label="Suivant" type="submit" />
      </form>
    </main>
  )
}