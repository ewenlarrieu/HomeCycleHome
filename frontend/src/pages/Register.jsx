import '../styles/Register.css'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  return (
    <main className="register-page">
      <h1 className="register-title">Créez votre compte</h1>
      <form className="register-container" aria-label="Formulaire d'inscription">
        <div className="register-field">
          <label htmlFor="nom" className="register-label">Nom</label>
          <input
            id="nom"
            type="text"
            className="register-input"
            placeholder="Votre nom"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="register-field">
          <label htmlFor="prenom" className="register-label">Prénom</label>
          <input
            id="prenom"
            type="text"
            className="register-input"
            placeholder="Votre prénom"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="register-field">
          <label htmlFor="email" className="register-label">Email</label>
          <input
            id="email"
            type="email"
            className="register-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
          />
        </div>
        <div className="register-field">
          <label htmlFor="telephone" className="register-label">Téléphone</label>
          <input
            id="telephone"
            type="tel"
            className="register-input"
            placeholder="Votre numéro de téléphone"
            autoComplete="tel"
            required
          />
        </div>
        <div className="register-field">
          <label htmlFor="password" className="register-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="register-input"
            placeholder="Votre mot de passe"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="register-field">
          <label htmlFor="confirm-password" className="register-label">Confirmer votre mot de passe</label>
          <input
            id="confirm-password"
            type="password"
            className="register-input"
            placeholder="Confirmez votre mot de passe"
            autoComplete="new-password"
            required
          />
        </div>
        <Button label="Créez votre compte" type="submit" />
        <p className="register-login-link">Vous avez déjà un compte ?</p>
        <Button label="Se connecter" onClick={() => navigate('/login')} />
      </form>
    </main>
  )
}