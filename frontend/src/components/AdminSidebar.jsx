import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import dashboardIcon from '../assets/images/dashboard.png'
import utilisateursIcon from '../assets/images/profil.png'
import interventionsIcon from '../assets/images/reserver.png'
import produitsIcon from '../assets/images/produits.png'
import parametresIcon from '../assets/images/settingadmin.png'
import logoutIcon from '../assets/images/logout.png'
import '../styles/ClientSidebar.css'

export default function AdminSidebar() {
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
          <NavLink to="/admin/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={dashboardIcon} alt="" width={24} height={24} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/utilisateurs" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={utilisateursIcon} alt="" width={24} height={24} />
            Utilisateurs
          </NavLink>
          <NavLink to="/admin/interventions" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={interventionsIcon} alt="" width={24} height={24} />
            Interventions
          </NavLink>
          <NavLink to="/admin/produits" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={produitsIcon} alt="" width={24} height={24} />
            Produits
          </NavLink>
          <NavLink to="/admin/parametres" onClick={closeMenu} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <img src={parametresIcon} alt="" width={24} height={24} />
            Paramètres
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
