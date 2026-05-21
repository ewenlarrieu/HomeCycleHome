import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import dashboardIcon from '../assets/images/dashboard.png'
import reserverIcon from '../assets/images/reserver.png'
import rendezVousIcon from '../assets/images/rendezvous.png'
import profilIcon from '../assets/images/profil.png'
import logoutIcon from '../assets/images/logout.png'
import '../styles/ClientSidebar.css'

export default function ClientSidebar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleDeconnexion = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      navigate('/login')
    }
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button className="sidebar-burger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}

      <aside className={`client-sidebar${isOpen ? ' open' : ''}`}>
        <div className="client-sidebar-nav">
          <NavLink to="/client/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={dashboardIcon} alt="" width={24} height={24} />
            Dashboard
          </NavLink>
          <NavLink to="/client/reserver" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={reserverIcon} alt="" width={24} height={24} />
            Réserver
          </NavLink>
          <NavLink to="/client/rendez-vous" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={rendezVousIcon} alt="" width={24} height={24} />
            Mes rendez-vous
          </NavLink>
          <NavLink to="/client/profil" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={profilIcon} alt="" width={24} height={24} />
            Profil
          </NavLink>
          <button className="sidebar-link sidebar-logout" onClick={handleDeconnexion}>
            <img src={logoutIcon} alt="" width={24} height={24} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
