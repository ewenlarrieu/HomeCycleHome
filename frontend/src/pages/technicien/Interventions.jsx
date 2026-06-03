import { useEffect, useState } from 'react'
import '../../styles/technicien/Interventions.css'

const STATUTS = ['à venir', 'en cours', 'terminé']

function InterventionCard({ rdv, onStatusChange }) {
  const [loading, setLoading] = useState(false)

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
        <select
          className={`interv-status-select interv-status--${statusLibelle.replace(' ', '-')}`}
          value={statusLibelle}
          onChange={handleChange}
          disabled={loading}
        >
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
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
          <p className="interv-card-label">Commentaire client</p>
          <p className="interv-card-value">{rdv.commentaire}</p>
        </div>
      )}
    </div>
  )
}

function InterventionTermineeRow({ rdv }) {
  const [expanded, setExpanded] = useState(false)
  const client = rdv.utilisateur_rendez_vous_id_clientToutilisateur

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
              <p className="interv-card-label">Commentaire client</p>
              <p className="interv-card-value">{rdv.commentaire}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function IntervSection({ title, rdvs, emptyMessage, onStatusChange, compact = false }) {
  return (
    <section className="interv-section">
      <h2 className="interv-section-title">{title}</h2>
      {rdvs.length === 0 ? (
        <p className="interv-empty">{emptyMessage}</p>
      ) : (
        <div className="interv-list">
          {rdvs.map(rdv => compact
            ? <InterventionTermineeRow key={rdv.id_rendez_vous} rdv={rdv} />
            : <InterventionCard key={rdv.id_rendez_vous} rdv={rdv} onStatusChange={onStatusChange} />
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

  if (loading) return <p className="interv-loading">Chargement...</p>
  if (error) return <p className="interv-loading">{error}</p>

  const today = new Date()
  const debutJour = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const finJour = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

  const aujourdhui = rdvs.filter(r => {
    const d = new Date(r.date_rdv)
    return d >= debutJour && d <= finJour
  })

  const actuelle = rdvs.filter(r => r.status_rendez_vous.libelle === 'en cours')

  const prochainsjours = rdvs.filter(r => {
    const d = new Date(r.date_rdv)
    return d > finJour && r.status_rendez_vous.libelle === 'à venir'
  })

  return (
    <main className="interv-page">
      <h1 className="interv-title">Mes interventions</h1>
      <IntervSection title="Aujourd'hui" rdvs={aujourdhui} emptyMessage="Aucune intervention aujourd'hui." onStatusChange={handleStatusChange} />
      <IntervSection title="Intervention actuelle" rdvs={actuelle} emptyMessage="Aucune intervention en cours." onStatusChange={handleStatusChange} />
      <IntervSection title="Dans les prochains jours" rdvs={prochainsjours} emptyMessage="Aucune intervention à venir." onStatusChange={handleStatusChange} />
      <IntervSection title="Interventions terminées" rdvs={rdvs.filter(r => r.status_rendez_vous.libelle === 'terminé')} emptyMessage="Aucune intervention terminée." onStatusChange={handleStatusChange} compact />
    </main>
  )
}
