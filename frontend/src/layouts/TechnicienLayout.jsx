import { Outlet, useLocation } from 'react-router-dom'
import TechnicienSidebar from '../components/TechnicienSidebar'
import '../styles/ClientLayout.css'

export default function TechnicienLayout() {
  const location = useLocation()

  return (
    <div className="client-layout">
      <TechnicienSidebar />
      <main className="client-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
