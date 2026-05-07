import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import '../styles/Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleHowItWorks = (e) => {
    e.preventDefault()
    setIsOpen(false)
    if (location.pathname === '/') {
      document.getElementById('comment-ca-marche')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById('comment-ca-marche')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

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
        <li><a href="#comment-ca-marche" onClick={handleHowItWorks}>Comment ça marche ?</a></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
        <li><Link to="/login" onClick={() => setIsOpen(false)}>Connexion</Link></li>
        <li><Link to="/register" onClick={() => setIsOpen(false)}>Inscription</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
