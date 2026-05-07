import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer>
      <p className="footer-brand">HomeCyl'Home</p>
      <p className="footer-tagline">Réparation et entretien de vélos à domicile</p>
      <div className="footer-nav">
        <Link to="/" className="footer-link">Accueil</Link>
        <a href="/#comment-ca-marche" className="footer-link">Comment ça marche ?</a>
        <Link to="/contact" className="footer-link">Contact</Link>
        <Link to="/login" className="footer-link">Connexion</Link>
        <Link to="/register" className="footer-link">Inscription</Link>
      </div>
      <a href="mailto:HomeCyclHome@gmail.com" className="footer-email">HomeCyclHome@gmail.com</a>
      <p className="footer-email">69000 Lyon</p>
      <hr className="footer-divider" />
      <p className="footer-copyright">© 2025 HomeCycl'Home</p>
      <p className="footer-copyright">Tous droits réservés</p>
    </footer>
  )
}

export default Footer
