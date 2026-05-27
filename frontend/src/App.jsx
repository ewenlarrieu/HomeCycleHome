import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PublicLayout from './layouts/PublicLayout'
import ClientLayout from './layouts/ClientLayout'
import TechnicienLayout from './layouts/TechnicienLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Contact from './pages/Contact'
import ClientDashboard from './pages/client/Dashboard'
import TechnicienDashboard from './pages/technicien/Dasboard'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUtilisateurs from './pages/admin/Utilisateurs'
import AdminDetailsUtilisateurs from './pages/admin/DetailsUtilisateurs'
import AdminInterventions from './pages/admin/Interventions'
import AdminProduits from './pages/admin/Produits'
import AdminParametres from './pages/admin/Parametres'
import TechnicienPlanning from './pages/technicien/Planning'
import TechnicienInterventions from './pages/technicien/Interventions'
import TechnicienProfile from './pages/technicien/Profile'
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
            <Route path="/admin/utilisateurs/:id" element={<AdminDetailsUtilisateurs />} />
            <Route path="/admin/interventions" element={<AdminInterventions />} />
            <Route path="/admin/produits" element={<AdminProduits />} />
            <Route path="/admin/parametres" element={<AdminParametres />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="technicien" />}>
          <Route element={<TechnicienLayout />}>
            <Route path="/technicien/dashboard" element={<TechnicienDashboard />} />
            <Route path="/technicien/planning" element={<TechnicienPlanning />} />
            <Route path="/technicien/interventions" element={<TechnicienInterventions />} />
            <Route path="/technicien/profil" element={<TechnicienProfile />} />
          </Route>
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
