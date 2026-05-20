import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PublicLayout from './layouts/PublicLayout'
import ClientLayout from './layouts/ClientLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Contact from './pages/Contact'
import ClientDashboard from './pages/client/Dashboard'
import ClientReserver from './pages/client/Reserver'
import ClientRendezVous from './pages/client/Rendez-vous'
import ClientProfile from './pages/client/Profile'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<ProtectedRoute role="client" />}>
          <Route element={<ClientLayout />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/reserver" element={<ClientReserver />} />
            <Route path="/client/rendez-vous" element={<ClientRendezVous />} />
            <Route path="/client/profil" element={<ClientProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
