import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Register.css'
import Button from '../components/Button'
import { register } from '../services/auth.service'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '', confirmer_mot_de_passe: ''
  })
  const [erreur, setErreur] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    try {
      await register(form.nom, form.prenom, form.email, form.telephone, form.mot_de_passe, form.confirmer_mot_de_passe)
      navigate('/client/dashboard')
    } catch (error) {
      setErreur(error.message)
    }
  }

  return (
    <main className="register-page">
      <h1 className="register-title">Créez votre compte</h1>
      <form className="register-container" aria-label="Formulaire d'inscription" onSubmit={handleSubmit}>
        <div className="register-field">
          <label htmlFor="nom" className="register-label">Nom</label>
          <input
            id="nom" name="nom" type="text" className="register-input"
            placeholder="Votre nom" autoComplete="family-name"
            required value={form.nom} onChange={handleChange}
          />
        </div>
        <div className="register-field">
          <label htmlFor="prenom" className="register-label">Prénom</label>
          <input
            id="prenom" name="prenom" type="text" className="register-input"
            placeholder="Votre prénom" autoComplete="given-name"
            required value={form.prenom} onChange={handleChange}
          />
        </div>
        <div className="register-field">
          <label htmlFor="email" className="register-label">Email</label>
          <input
            id="email" name="email" type="email" className="register-input"
            placeholder="Votre adresse email" autoComplete="email"
            required value={form.email} onChange={handleChange}
          />
        </div>
        <div className="register-field">
          <label htmlFor="telephone" className="register-label">Téléphone</label>
          <input
            id="telephone" name="telephone" type="tel" className="register-input"
            placeholder="Votre numéro de téléphone" autoComplete="tel"
            required value={form.telephone} onChange={handleChange}
          />
        </div>
        <div className="register-field">
          <label htmlFor="password" className="register-label">Mot de passe</label>
          <input
            id="password" name="mot_de_passe" type="password" className="register-input"
            placeholder="Votre mot de passe" autoComplete="new-password"
            required value={form.mot_de_passe} onChange={handleChange}
          />
        </div>
        <div className="register-field">
          <label htmlFor="confirm-password" className="register-label">Confirmer votre mot de passe</label>
          <input
            id="confirm-password" name="confirmer_mot_de_passe" type="password" className="register-input"
            placeholder="Confirmez votre mot de passe" autoComplete="new-password"
            required value={form.confirmer_mot_de_passe} onChange={handleChange}
          />
        </div>
        {erreur && <p className="register-erreur">{erreur}</p>}
        <Button label="Créez votre compte" type="submit" />
        <p className="register-login-link">Vous avez déjà un compte ?</p>
        <Button label="Se connecter" onClick={() => navigate('/login')} />
      </form>
    </main>
  )
}
