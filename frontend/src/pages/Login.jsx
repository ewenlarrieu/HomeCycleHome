import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import Button from '../components/Button'
import { login } from '../services/auth.service'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    try {
      const utilisateur = await login(email, motDePasse)

      const role = utilisateur.role.libelle
      if (role === 'client') navigate('/client/dashboard')
      else if (role === 'technicien') navigate('/technicien/dashboard')
      else if (role === 'admin') navigate('/admin/dashboard')
    } catch (error) {
      setErreur(error.message)
    }
  }

  return (
    <main className="login-page">
      <h1 className="login-title">Connexion</h1>
      <form className="login-container" aria-label="Formulaire de connexion" onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>
        {erreur && <p className="login-erreur">{erreur}</p>}
        <Link to="/forgotpassword" className="login-forgot">Mot de passe oublié</Link>
        <Button label="Connexion" type="submit" />
      </form>
    </main>
  )
}
