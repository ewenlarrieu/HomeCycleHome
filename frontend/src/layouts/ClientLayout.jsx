import { Outlet } from 'react-router-dom'
import ClientSidebar from '../components/ClientSidebar'
import '../styles/ClientLayout.css'

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <ClientSidebar />
      <main className="client-content">
        <Outlet />
      </main>
    </div>
  )
}
