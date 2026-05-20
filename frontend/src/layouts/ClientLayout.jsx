import { Outlet, useLocation } from 'react-router-dom'
import ClientSidebar from '../components/ClientSidebar'
import '../styles/ClientLayout.css'

export default function ClientLayout() {
  const location = useLocation()

  return (
    <div className="client-layout">
      <ClientSidebar />
      <main className="client-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
