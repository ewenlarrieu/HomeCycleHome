import '../styles/Contact.css'
import Button from '../components/Button'

export default function Contact() {
  return (
    <main className="contact-page">
      <h1 className="contact-page-title">Contactez-nous</h1>
      <p className="contact-page-desc">Une question sur nos interventions ou nos services ? Envoyez-nous un message, notre équipe vous répond rapidement.</p>
      <form id="contact-form" className="contact-form-container" aria-label="Formulaire de contact">
        <div className="contact-field">
          <label htmlFor="email" className="contact-label">Email</label>
          <input
            id="email"
            type="email"
            className="contact-input"
            placeholder="Votre adresse email"
            autoComplete="email"
            required
          />
        </div>
        <div className="contact-field">
          <label htmlFor="message" className="contact-label">Message</label>
          <textarea
            id="message"
            className="contact-textarea"
            placeholder="Rédigez votre message ici"
            required
          />
        </div>
      </form>
      <Button label="Envoyer" type="submit" form="contact-form" />
    </main>
  )
}
