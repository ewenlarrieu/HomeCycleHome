import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import dashboardIcon from '../assets/images/dashboard.png'
import planningIcon from '../assets/images/planning.png'
import interventionsIcon from '../assets/images/rendezvous.png'
import profilIcon from '../assets/images/profil.png'
import logoutIcon from '../assets/images/logout.png'
import '../styles/ClientSidebar.css'

export default function TechnicienSidebar() {
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
          <NavLink to="/technicien/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={dashboardIcon} alt="" width={24} height={24} />
            Dashboard
          </NavLink>
          <NavLink to="/technicien/planning" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={planningIcon} alt="" width={24} height={24} />
            Planning
          </NavLink>
          <NavLink to="/technicien/interventions" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={interventionsIcon} alt="" width={24} height={24} />
            Mes interventions
          </NavLink>
          <NavLink to="/technicien/profil" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
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
