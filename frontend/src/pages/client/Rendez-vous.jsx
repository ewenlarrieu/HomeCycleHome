import { useEffect, useState } from 'react'
import '../../styles/client/RendezVous.css'

function RdvCard({ rdv, onAnnuler }) {
  const [loading, setLoading] = useState(false)

  const handleAnnuler = async () => {
    if (!window.confirm('Confirmer l\'annulation de ce rendez-vous ?')) return
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/rendez-vous/${rdv.id_rendez_vous}/annuler`, {
        method: 'PUT',
        credentials: 'include',
      })
      if (res.ok) onAnnuler(rdv.id_rendez_vous)
    } finally {
      setLoading(false)
    }
  }

  const canAnnuler = rdv.status_rendez_vous.libelle === 'à venir'

  return (
    <div className="rdv-card">
      <div className="rdv-card-header">
        <div>
          <p className="rdv-card-service">{rdv.forfait_intervention.nom_service}</p>
          <p className="rdv-card-date">
            {new Date(rdv.date_rdv).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
        <div className="rdv-card-header-right">
          <span className={`rdv-card-status rdv-card-status--${rdv.status_rendez_vous.libelle.replace(' ', '-')}`}>
            {rdv.status_rendez_vous.libelle}
          </span>
          {canAnnuler && (
            <button className="rdv-card-btn-annuler" onClick={handleAnnuler} disabled={loading}>
              {loading ? '...' : 'Annuler'}
            </button>
          )}
        </div>
      </div>

      <div className="rdv-card-divider" />

      <div className="rdv-card-body">
        <div className="rdv-card-info">
          <p className="rdv-card-label">Adresse</p>
          <p className="rdv-card-value">{rdv.adresse.numero_rue} {rdv.adresse.rue}{rdv.adresse.complement_adresse ? `, ${rdv.adresse.complement_adresse}` : ''}</p>
          <p className="rdv-card-value rdv-card-value--muted">{rdv.adresse.ville.code_postal} {rdv.adresse.ville.nom_ville} — {rdv.adresse.zone.nom_zone}</p>
        </div>
        <div className="rdv-card-info">
          <p className="rdv-card-label">Cycle</p>
          <p className="rdv-card-value">{rdv.cycles.nom}</p>
          <p className="rdv-card-value rdv-card-value--muted">{rdv.cycles.marque} · {rdv.cycles.annee} · {rdv.cycles.type_cycle.libelle}</p>
        </div>
        <div className="rdv-card-info">
          <p className="rdv-card-label">Technicien</p>
          <p className="rdv-card-value">{rdv.utilisateur_rendez_vous_id_technicienToutilisateur.prenom} {rdv.utilisateur_rendez_vous_id_technicienToutilisateur.nom}</p>
        </div>
        <div className="rdv-card-info">
          <p className="rdv-card-label">Prix</p>
          <p className="rdv-card-value rdv-card-value--prix">{parseFloat(rdv.forfait_intervention.prix).toFixed(2)} €</p>
        </div>
      </div>

      {rdv.commentaire && (
        <div className="rdv-card-commentaire">
          <p className="rdv-card-label">Commentaire</p>
          <p className="rdv-card-value">{rdv.commentaire}</p>
        </div>
      )}
    </div>
  )
}

function RdvSection({ title, rdvs, emptyMessage, onAnnuler }) {
  if (rdvs.length === 0) return (
    <section className="rdv-section">
      <h2 className="rdv-section-title">{title}</h2>
      <p className="rdv-empty">{emptyMessage}</p>
    </section>
  )

  return (
    <section className="rdv-section">
      <h2 className="rdv-section-title">{title}</h2>
      <div className="rdv-list">
        {rdvs.map(rdv => <RdvCard key={rdv.id_rendez_vous} rdv={rdv} onAnnuler={onAnnuler} />)}
      </div>
    </section>
  )
}

export default function RendezVous() {
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/client/rendez-vous`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setRdvs(data))
      .catch(() => setError('Impossible de charger les rendez-vous.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="rdv-loading">Chargement...</p>
  if (error) return <p className="rdv-loading">{error}</p>

  const handleAnnuler = (id) => {
    setRdvs(prev => prev.map(r =>
      r.id_rendez_vous === id
        ? { ...r, status_rendez_vous: { libelle: 'annulé' } }
        : r
    ))
  }

  const aVenir = rdvs.filter(r => r.status_rendez_vous.libelle === 'à venir')
  const enCours = rdvs.filter(r => r.status_rendez_vous.libelle === 'en cours')
  const termines = rdvs.filter(r => r.status_rendez_vous.libelle === 'terminé')
  const annules = rdvs.filter(r => r.status_rendez_vous.libelle === 'annulé')

  return (
    <main className="rdv-page">
      <h1 className="rdv-title">Mes rendez-vous</h1>

      <RdvSection title="À venir" rdvs={aVenir} emptyMessage="Aucun rendez-vous à venir." onAnnuler={handleAnnuler} />
      <RdvSection title="En cours" rdvs={enCours} emptyMessage="Aucun rendez-vous en cours." onAnnuler={handleAnnuler} />
      <RdvSection title="Terminés" rdvs={termines} emptyMessage="Aucun rendez-vous terminé." onAnnuler={handleAnnuler} />
      <RdvSection title="Annulés" rdvs={annules} emptyMessage="Aucun rendez-vous annulé." onAnnuler={handleAnnuler} />
    </main>
  )
}
