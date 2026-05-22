import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import '../styles/ClientLayout.css'

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="client-layout">
      <AdminSidebar />
      <main className="client-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
