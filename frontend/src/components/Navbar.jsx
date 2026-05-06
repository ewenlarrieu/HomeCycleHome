import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import '../styles/Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      <Link to="/"><img src={logo} alt="LeCycleLyonnais" /></Link>

      <button className="burger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={isOpen ? 'open' : ''}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link></li>
        <li><Link to="/#comment-ca-marche" onClick={() => setIsOpen(false)}>Comment ça marche ?</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
        <li><Link to="/login" onClick={() => setIsOpen(false)}>Connexion</Link></li>
        <li><Link to="/register" onClick={() => setIsOpen(false)}>Inscription</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
