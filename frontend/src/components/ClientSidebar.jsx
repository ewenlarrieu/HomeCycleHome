import { NavLink, useNavigate } from 'react-router-dom'
import dashboardIcon from '../assets/images/dashboard.png'
import reserverIcon from '../assets/images/reserver.png'
import rendezVousIcon from '../assets/images/rendezvous.png'
import profilIcon from '../assets/images/profil.png'
import logoutIcon from '../assets/images/logout.png'
import '../styles/ClientSidebar.css'

export default function ClientSidebar() {
  const navigate = useNavigate()

  const handleDeconnexion = () => {
    navigate('/login')
  }

  return (
    <aside className="client-sidebar">
      <div className="client-sidebar-nav">
        <NavLink to="/client/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <img src={dashboardIcon} alt="" width={24} height={24} />
          Dashboard
        </NavLink>
        <NavLink to="/client/reserver" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <img src={reserverIcon} alt="" width={24} height={24} />
          Réserver
        </NavLink>
        <NavLink to="/client/rendez-vous" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <img src={rendezVousIcon} alt="" width={24} height={24} />
          Mes rendez-vous
        </NavLink>
        <NavLink to="/client/profil" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <img src={profilIcon} alt="" width={24} height={24} />
          Profil
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={handleDeconnexion}>
          <img src={logoutIcon} alt="" width={24} height={24} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
