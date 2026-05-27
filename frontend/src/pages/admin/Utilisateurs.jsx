import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/admin/Utilisateurs.css'

function CreateModal({ role, onClose, onCreate }) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Une erreur est survenue.'); return }
      onCreate(data)
      onClose()
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  const label = role === 'client' ? 'un client' : 'un technicien'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Ajouter {label}</h3>

        <div className="modal-field">
          <label className="modal-label">Nom</label>
          <input className="modal-input" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Prénom</label>
          <input className="modal-input" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Email</label>
          <input className="modal-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Téléphone</label>
          <input className="modal-input" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Mot de passe</label>
          <input className="modal-input" name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleChange} placeholder="8 caractères minimum" />
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="modal-btn-confirm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionModal({ utilisateur, onClose, onUpdate }) {
  const [role, setRole] = useState(utilisateur.role.libelle)
  const [loading, setLoading] = useState(false)

  const handleRole = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs/${utilisateur.id_utilisateur}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      })
      const data = await res.json()
      if (res.ok) { onUpdate(data); onClose() }
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs/${utilisateur.id_utilisateur}/status`, {
        method: 'PUT',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) { onUpdate(data); onClose() }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Actions — {utilisateur.prenom} {utilisateur.nom}</h3>

        <div className="modal-field">
          <label className="modal-label">Rôle</label>
          <select className="modal-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="technicien">Technicien</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          className={`modal-btn-status ${utilisateur.status_compte.libelle === 'actif' ? 'desactiver' : 'activer'}`}
          onClick={handleStatus}
          disabled={loading}
        >
          {utilisateur.status_compte.libelle === 'actif' ? 'Désactiver le compte' : 'Activer le compte'}
        </button>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="modal-btn-confirm" onClick={handleRole} disabled={loading}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

function UserRow({ u, onAction, onDetail }) {
  return (
    <tr>
      <td>{u.nom}</td>
      <td>{u.prenom}</td>
      <td>{u.email}</td>
      <td>{u.telephone}</td>
      <td className="utilisateurs-status">
        <span className={`status-dot ${u.status_compte.libelle === 'actif' ? 'actif' : 'inactif'}`}></span>
        {u.status_compte.libelle}
      </td>
      <td className="utilisateurs-actions">
        <button className="btn-table" onClick={() => onDetail(u.id_utilisateur)}>Détail</button>
        <button className="btn-table" onClick={() => onAction(u)}>Action</button>
      </td>
    </tr>
  )
}

export default function Utilisateurs() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [techniciens, setTechniciens] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [createRole, setCreateRole] = useState(null)
  const [searchClient, setSearchClient] = useState('')
  const [searchTechnicien, setSearchTechnicien] = useState('')

  const filteredClients = clients.filter(u =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchClient.toLowerCase())
  )

  const filteredTechniciens = techniciens.filter(u =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchTechnicien.toLowerCase())
  )

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => { setClients(data.clients); setTechniciens(data.techniciens) })
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = (updated) => {
    const update = list => list.map(u => u.id_utilisateur === updated.id_utilisateur ? updated : u)
    setClients(prev => update(prev))
    setTechniciens(prev => update(prev))

    // Déplace dans la bonne section si le rôle a changé
    setClients(prev => {
      const all = [...prev, ...techniciens].map(u => u.id_utilisateur === updated.id_utilisateur ? updated : u)
      return all.filter(u => u.role.libelle === 'client')
    })
    setTechniciens(prev => {
      const all = [...clients, ...prev].map(u => u.id_utilisateur === updated.id_utilisateur ? updated : u)
      return all.filter(u => u.role.libelle === 'technicien')
    })
  }

  const handleCreate = (newUser) => {
    if (newUser.role.libelle === 'client') setClients(prev => [...prev, newUser])
    else setTechniciens(prev => [...prev, newUser])
  }

  if (loading) return <p className="utilisateurs-loading">Chargement...</p>

  return (
    <main className="utilisateurs-page">
      <h1 className="utilisateurs-title">Gestion des utilisateurs</h1>

      <section className="utilisateurs-section">
        <div className="utilisateurs-header">
          <h2 className="utilisateurs-h2">Client :</h2>
          <input
            className="utilisateurs-search"
            type="text"
            placeholder="Rechercher un client"
            value={searchClient}
            onChange={e => setSearchClient(e.target.value)}
          />
          <button className="btn-table" onClick={() => setCreateRole('client')}>Ajouter un client</button>
        </div>
        <div className="utilisateurs-container">
          <table className="utilisateurs-table">
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Téléphone</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {filteredClients.length === 0
                ? <tr><td colSpan={6} className="utilisateurs-empty">Aucun client</td></tr>
                : filteredClients.map(u => <UserRow key={u.id_utilisateur} u={u} onAction={setSelectedUser} onDetail={(id) => navigate(`/admin/utilisateurs/${id}`)} />)
              }
            </tbody>
          </table>
        </div>
      </section>

      <section className="utilisateurs-section">
        <div className="utilisateurs-header">
          <h2 className="utilisateurs-h2">Technicien :</h2>
          <input
            className="utilisateurs-search"
            type="text"
            placeholder="Rechercher un technicien"
            value={searchTechnicien}
            onChange={e => setSearchTechnicien(e.target.value)}
          />
          <button className="btn-table" onClick={() => setCreateRole('technicien')}>Ajouter un technicien</button>
        </div>
        <div className="utilisateurs-container">
          <table className="utilisateurs-table">
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Téléphone</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {filteredTechniciens.length === 0
                ? <tr><td colSpan={6} className="utilisateurs-empty">Aucun technicien</td></tr>
                : filteredTechniciens.map(u => <UserRow key={u.id_utilisateur} u={u} onAction={setSelectedUser} onDetail={(id) => navigate(`/admin/utilisateurs/${id}`)} />)
              }
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <ActionModal
          utilisateur={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdate}
        />
      )}

      {createRole && (
        <CreateModal
          role={createRole}
          onClose={() => setCreateRole(null)}
          onCreate={handleCreate}
        />
      )}
    </main>
  )
}
