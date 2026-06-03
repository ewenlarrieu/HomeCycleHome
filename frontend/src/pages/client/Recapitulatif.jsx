import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import '../../styles/client/Recapitulatif.css'

export default function Recapitulatif() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!state) {
    navigate('/client/reserver')
    return null
  }

  const { forfait, adresse, creneau, cycle, commentaire } = state

  const handleConfirmer = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/rendez-vous`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_disponibilite: creneau.id,
          id_service: forfait.id_service,
          id_cycle: cycle.id_cycle,
          id_adresse: adresse.id_adresse,
          commentaire: commentaire || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Une erreur est survenue.'); return }
      navigate('/client/rendez-vous')
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="recap-page">
      <h1 className="recap-title">Récapitulatif</h1>
      <h2 className="recap-subtitle">Vérifiez les informations avant de confirmer</h2>

      <div className="recap-container">
        <div className="recap-section">
          <h3 className="recap-section-title">Type d'intervention</h3>
          {forfait ? (
            <div className="recap-row">
              <span className="recap-label">{forfait.nom_service}</span>
              <span className="recap-value">{parseFloat(forfait.prix).toFixed(2)} €{forfait.duree_estimee_minutes ? ` · ${forfait.duree_estimee_minutes} min` : ''}</span>
            </div>
          ) : (
            <p className="recap-missing">Non renseigné</p>
          )}
        </div>

        <div className="recap-divider" />

        <div className="recap-section">
          <h3 className="recap-section-title">Adresse</h3>
          {adresse ? (
            <>
              <p className="recap-info">{adresse.numero_rue} {adresse.rue}{adresse.complement_adresse ? `, ${adresse.complement_adresse}` : ''}</p>
              <p className="recap-info recap-info--muted">{adresse.ville.code_postal} {adresse.ville.nom_ville} — {adresse.zone.nom_zone}</p>
            </>
          ) : (
            <p className="recap-missing">Non renseignée</p>
          )}
        </div>

        <div className="recap-divider" />

        <div className="recap-section">
          <h3 className="recap-section-title">Créneau</h3>
          {creneau ? (
            <>
              <p className="recap-info">{new Date(creneau.start).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
              <p className="recap-info recap-info--muted">Technicien : {creneau.title}</p>
            </>
          ) : (
            <p className="recap-missing">Non sélectionné</p>
          )}
        </div>

        <div className="recap-divider" />

        <div className="recap-section">
          <h3 className="recap-section-title">Cycle</h3>
          {cycle ? (
            <>
              <p className="recap-info">{cycle.nom}</p>
              <p className="recap-info recap-info--muted">{cycle.marque} · {cycle.annee} · {cycle.type_cycle.libelle}</p>
            </>
          ) : (
            <p className="recap-missing">Non sélectionné</p>
          )}
        </div>

        {commentaire && (
          <>
            <div className="recap-divider" />
            <div className="recap-section">
              <h3 className="recap-section-title">Commentaire</h3>
              <p className="recap-info">{commentaire}</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="recap-error">{error}</p>}

      <div className="recap-actions">
        <button className="recap-btn-retour" onClick={() => navigate('/client/reserver')}>Retour</button>
        <Button label={loading ? 'Confirmation...' : 'Confirmer le rendez-vous'} onClick={handleConfirmer} />
      </div>
    </main>
  )
}
