import { useEffect, useState } from 'react'
import '../../styles/technicien/Interventions.css'

const STATUTS = ['à venir', 'en cours', 'terminé']

function EditModal({ rdv, onClose, onSave }) {
  const [commentaire, setCommentaire] = useState(rdv.commentaire || '')
  const [duree, setDuree] = useState(rdv.duree_rdv || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions/${rdv.id_rendez_vous}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentaire, duree_rdv: duree }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Une erreur est survenue.')
      } else {
        onSave(data)
        onClose()
      }
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="edit-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Modifier l'intervention</h2>
          <button className="edit-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="edit-modal-body">
          <div className="edit-field">
            <label className="edit-label">Service</label>
            <p className="edit-value-readonly">{rdv.forfait_intervention.nom_service}</p>
          </div>

          <div className="edit-field">
            <label className="edit-label">Date</label>
            <p className="edit-value-readonly">
              {new Date(rdv.date_rdv).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>

          <div className="edit-field">
            <label className="edit-label" htmlFor="edit-duree">Durée réelle (minutes)</label>
            <input
              id="edit-duree"
              type="number"
              min="1"
              className="edit-input"
              value={duree}
              onChange={e => setDuree(e.target.value)}
              placeholder="Durée en minutes"
            />
          </div>

          <div className="edit-field">
            <label className="edit-label" htmlFor="edit-commentaire">Commentaire / Notes</label>
            <textarea
              id="edit-commentaire"
              className="edit-textarea"
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
              placeholder="Ajouter un commentaire sur l'intervention..."
              rows={4}
            />
          </div>

          {error && <p className="edit-error">{error}</p>}
        </div>

        <div className="edit-modal-footer">
          <button className="edit-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="edit-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InterventionCard({ rdv, onStatusChange, onEdit }) {
  const [loading, setLoading] = useState(false)
  const [loadingAnnuler, setLoadingAnnuler] = useState(false)

  const handleChange = async (e) => {
    const libelle = e.target.value
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions/${rdv.id_rendez_vous}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libelle }),
      })
      const data = await res.json()
      if (res.ok) onStatusChange(rdv.id_rendez_vous, data.status_rendez_vous.libelle)
    } finally {
      setLoading(false)
    }
  }

  const handleAnnuler = async () => {
    if (!window.confirm('Confirmer l\'annulation de cette intervention ?')) return
    setLoadingAnnuler(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions/${rdv.id_rendez_vous}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libelle: 'annulé' }),
      })
      const data = await res.json()
      if (res.ok) onStatusChange(rdv.id_rendez_vous, data.status_rendez_vous.libelle)
    } catch (e) {
      alert('Impossible de contacter le serveur : ' + e.message)
    } finally {
      setLoadingAnnuler(false)
    }
  }

  const client = rdv.utilisateur_rendez_vous_id_clientToutilisateur
  const statusLibelle = rdv.status_rendez_vous.libelle

  return (
    <div className="interv-card">
      <div className="interv-card-header">
        <div>
          <p className="interv-card-service">{rdv.forfait_intervention.nom_service}</p>
          <p className="interv-card-date">
            {new Date(rdv.date_rdv).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
        <div className="interv-card-header-right">
          <select
            className={`interv-status-select interv-status--${statusLibelle.replace(' ', '-')}`}
            value={statusLibelle}
            onChange={handleChange}
            disabled={loading}
          >
            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="interv-btn-modifier" onClick={() => onEdit(rdv)}>Modifier</button>
          <button className="interv-btn-annuler" onClick={handleAnnuler} disabled={loadingAnnuler}>
            {loadingAnnuler ? '...' : 'Annuler'}
          </button>
        </div>
      </div>

      <div className="interv-card-divider" />

      <div className="interv-card-body">
        <div className="interv-card-info">
          <p className="interv-card-label">Client</p>
          <p className="interv-card-value">{client.prenom} {client.nom}</p>
          <p className="interv-card-value interv-card-value--muted">{client.telephone}</p>
        </div>
        <div className="interv-card-info">
          <p className="interv-card-label">Adresse</p>
          <p className="interv-card-value">{rdv.adresse.numero_rue} {rdv.adresse.rue}{rdv.adresse.complement_adresse ? `, ${rdv.adresse.complement_adresse}` : ''}</p>
          <p className="interv-card-value interv-card-value--muted">{rdv.adresse.ville.code_postal} {rdv.adresse.ville.nom_ville} — {rdv.adresse.zone.nom_zone}</p>
        </div>
        <div className="interv-card-info">
          <p className="interv-card-label">Cycle</p>
          <p className="interv-card-value">{rdv.cycles.nom}</p>
          <p className="interv-card-value interv-card-value--muted">{rdv.cycles.marque} · {rdv.cycles.annee} · {rdv.cycles.type_cycle.libelle}</p>
        </div>
        <div className="interv-card-info">
          <p className="interv-card-label">Prix</p>
          <p className="interv-card-value interv-card-value--prix">{parseFloat(rdv.forfait_intervention.prix).toFixed(2)} €</p>
        </div>
      </div>

      {rdv.commentaire && (
        <div className="interv-card-commentaire">
          <p className="interv-card-label">Commentaire</p>
          <p className="interv-card-value">{rdv.commentaire}</p>
        </div>
      )}
    </div>
  )
}

function InterventionCompactRow({ rdv, onStatusChange, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const client = rdv.utilisateur_rendez_vous_id_clientToutilisateur
  const statusLibelle = rdv.status_rendez_vous.libelle

  const handleChange = async (e) => {
    const libelle = e.target.value
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions/${rdv.id_rendez_vous}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libelle }),
      })
      const data = await res.json()
      if (res.ok) onStatusChange(rdv.id_rendez_vous, data.status_rendez_vous.libelle)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="interv-terminee-row">
      <div className="interv-terminee-header">
        <div>
          <p className="interv-terminee-service">{rdv.forfait_intervention.nom_service}</p>
          <p className="interv-terminee-date">
            {new Date(rdv.date_rdv).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
        <button className="interv-terminee-btn" onClick={() => setExpanded(p => !p)}>
          {expanded ? 'Masquer' : 'Plus de détails'}
        </button>
      </div>

      {expanded && (
        <div className="interv-terminee-details">
          <div className="interv-card-divider" />
          {onStatusChange && (
            <div className="interv-compact-status">
              <p className="interv-card-label">Statut</p>
              <select
                className={`interv-status-select interv-status--${statusLibelle.replace(' ', '-')}`}
                value={statusLibelle}
                onChange={handleChange}
                disabled={loading}
              >
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
          <div className="interv-card-body">
            <div className="interv-card-info">
              <p className="interv-card-label">Client</p>
              <p className="interv-card-value">{client.prenom} {client.nom}</p>
              <p className="interv-card-value interv-card-value--muted">{client.telephone}</p>
            </div>
            <div className="interv-card-info">
              <p className="interv-card-label">Adresse</p>
              <p className="interv-card-value">{rdv.adresse.numero_rue} {rdv.adresse.rue}{rdv.adresse.complement_adresse ? `, ${rdv.adresse.complement_adresse}` : ''}</p>
              <p className="interv-card-value interv-card-value--muted">{rdv.adresse.ville.code_postal} {rdv.adresse.ville.nom_ville}</p>
            </div>
            <div className="interv-card-info">
              <p className="interv-card-label">Cycle</p>
              <p className="interv-card-value">{rdv.cycles.nom}</p>
              <p className="interv-card-value interv-card-value--muted">{rdv.cycles.marque} · {rdv.cycles.annee}</p>
            </div>
            <div className="interv-card-info">
              <p className="interv-card-label">Prix</p>
              <p className="interv-card-value interv-card-value--prix">{parseFloat(rdv.forfait_intervention.prix).toFixed(2)} €</p>
            </div>
          </div>
          {rdv.commentaire && (
            <div className="interv-card-commentaire">
              <p className="interv-card-label">Commentaire</p>
              <p className="interv-card-value">{rdv.commentaire}</p>
            </div>
          )}
          {onEdit && (
            <div className="interv-compact-modifier">
              <button className="interv-btn-modifier" onClick={() => onEdit(rdv)}>Modifier l'intervention</button>
            </div>
          )}
          {onStatusChange && (
            <div className="interv-compact-annuler">
              <button
                className="interv-btn-annuler"
                onClick={async () => {
                  if (!window.confirm('Confirmer l\'annulation de cette intervention ?')) return
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions/${rdv.id_rendez_vous}/status`, {
                      method: 'PUT',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ libelle: 'annulé' }),
                    })
                    const data = await res.json()
                    if (res.ok) onStatusChange(rdv.id_rendez_vous, data.status_rendez_vous.libelle)
                  } catch (e) {
                    alert('Impossible de contacter le serveur.')
                  }
                }}
              >
                Annuler l'intervention
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function IntervSection({ title, rdvs, emptyMessage, onStatusChange, onEdit, compact = false }) {
  return (
    <section className="interv-section">
      <h2 className="interv-section-title">{title}</h2>
      {rdvs.length === 0 ? (
        <p className="interv-empty">{emptyMessage}</p>
      ) : (
        <div className="interv-list">
          {rdvs.map(rdv => compact
            ? <InterventionCompactRow key={rdv.id_rendez_vous} rdv={rdv} onStatusChange={onStatusChange} onEdit={onEdit} />
            : <InterventionCard key={rdv.id_rendez_vous} rdv={rdv} onStatusChange={onStatusChange} onEdit={onEdit} />
          )}
        </div>
      )}
    </section>
  )
}

export default function Interventions() {
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editRdv, setEditRdv] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/technicien/interventions`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setRdvs(data))
      .catch(() => setError('Impossible de charger les interventions.'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = (id, newLibelle) => {
    setRdvs(prev => prev.map(r =>
      r.id_rendez_vous === id
        ? { ...r, status_rendez_vous: { libelle: newLibelle } }
        : r
    ))
  }

  const handleSaveEdit = (updated) => {
    setRdvs(prev => prev.map(r =>
      r.id_rendez_vous === updated.id_rendez_vous ? updated : r
    ))
  }

  if (loading) return <p className="interv-loading">Chargement...</p>
  if (error) return <p className="interv-loading">{error}</p>

  const today = new Date()
  const debutJour = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const finJour = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

  const aujourdhui = rdvs.filter(r => {
    const d = new Date(r.date_rdv)
    return d >= debutJour && d <= finJour && r.status_rendez_vous.libelle !== 'annulé'
  })

  const actuelle = rdvs.filter(r => r.status_rendez_vous.libelle === 'en cours')

  const prochainsjours = rdvs.filter(r => {
    const d = new Date(r.date_rdv)
    return d > finJour && r.status_rendez_vous.libelle === 'à venir'
  })

  return (
    <main className="interv-page">
      <h1 className="interv-title">Mes interventions</h1>
      <IntervSection title="Aujourd'hui" rdvs={aujourdhui} emptyMessage="Aucune intervention aujourd'hui." onStatusChange={handleStatusChange} onEdit={setEditRdv} />
      <IntervSection title="Intervention actuelle" rdvs={actuelle} emptyMessage="Aucune intervention en cours." onStatusChange={handleStatusChange} onEdit={setEditRdv} />
      <IntervSection title="Dans les prochains jours" rdvs={prochainsjours} emptyMessage="Aucune intervention à venir." onStatusChange={handleStatusChange} onEdit={setEditRdv} compact />
      <IntervSection title="Interventions terminées" rdvs={rdvs.filter(r => r.status_rendez_vous.libelle === 'terminé')} emptyMessage="Aucune intervention terminée." onEdit={setEditRdv} compact />
      <IntervSection title="Interventions annulées" rdvs={rdvs.filter(r => r.status_rendez_vous.libelle === 'annulé')} emptyMessage="Aucune intervention annulée." compact />

      {editRdv && (
        <EditModal
          rdv={editRdv}
          onClose={() => setEditRdv(null)}
          onSave={handleSaveEdit}
        />
      )}
    </main>
  )
}
