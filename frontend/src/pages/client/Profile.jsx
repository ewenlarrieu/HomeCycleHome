import { useEffect, useState } from 'react'
import '../../styles/client/Profile.css'
import Button from '../../components/Button'

export default function Profile() {
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/client/profil`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du profil')
        return res.json()
      })
      .then(data => setProfil(data))
      .catch(() => setError('Impossible de charger le profil.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="profile-loading">Chargement...</p>
  if (error) return <p className="profile-loading">{error}</p>
  if (!profil) return null

  return (
    <main className="profile-page">
      <h1 className="profile-title">Mon profil</h1>
<h2 className="profile-subtitle">Informations personnelles :</h2>
      <section className="profile-section">
        
        <div className="profile-grid">
          <div className="profile-field">
            <h3 className="profile-info">Nom</h3>
            <input className="profile-input" value={profil.nom} readOnly />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Prénom</h3>
            <input className="profile-input" value={profil.prenom} readOnly />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Email</h3>
            <input className="profile-input" value={profil.email} readOnly />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Téléphone</h3>
            <input className="profile-input" value={profil.telephone ?? ''} readOnly />
          </div>
        </div>
      </section>

      <h2 className="profile-subtitle profile-subtitle--adresses">Mes adresses :</h2>
      <section className="profile-section profile-section--compact">
        {profil.adresse && profil.adresse.length > 0 ? (
          <div className="profile-adresses">
            {profil.adresse.map(adr => (
              <div key={adr.id_adresse} className="profile-adresse-card">
                <p className="profile-adresse-ligne">{adr.numero_rue} {adr.rue}</p>
                {adr.complement_adresse && (
                  <p className="profile-adresse-ligne">{adr.complement_adresse}</p>
                )}
                <p className="profile-adresse-ligne">{adr.ville.code_postal} {adr.ville.nom_ville} — {adr.zone.nom_zone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-no-adresse">Aucune adresse enregistrée.</p>
        )}
        <div className="profile-adresse-btn">
          <Button label="Ajouter une nouvelle adresse" />
        </div>
      </section>

      <h2 className="profile-subtitle profile-subtitle--cycles">Mes cycles :</h2>
      <section className="profile-section profile-section--compact">
        {profil.cycles && profil.cycles.length > 0 ? (
          <div className="profile-cycles">
            {profil.cycles.map(cycle => (
              <div key={cycle.id_cycle} className="profile-cycle-card">
                <p className="profile-cycle-ligne">{cycle.type_cycle.libelle} — {cycle.marque} ({cycle.annee})</p>
                {cycle.commentaire && (
                  <p className="profile-cycle-commentaire">{cycle.commentaire}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-no-adresse">Aucun cycle enregistré.</p>
        )}
        <div className="profile-adresse-btn">
          <Button label="Ajouter un nouveau cycle" />
        </div>
      </section>

      <div className="profile-save-btn">
        <Button label="Enregistrer les modifications" />
      </div>

      <div className="profile-delete-btn">
        <Button label="Supprimer mon compte" />
      </div>
    </main>
  )
}
