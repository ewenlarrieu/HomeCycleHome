import '../styles/Login.css'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Login() {
  return (
    <main className="login-page">
      <h1 className="login-title">Connexion</h1>
      <form id="login-form" className="login-container" aria-label="Formulaire de connexion">
        <div className="login-field">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="password" className="login-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />
        </div>
        <Link to="/forgotpassword" className="login-forgot">Mot de passe oublié</Link>
        <Button label="Connexion" type="submit" />
      </form>
    </main>
  )
}
