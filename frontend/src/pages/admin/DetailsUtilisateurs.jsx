import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../../styles/admin/DetailsUtilisateurs.css'
import Button from '../../components/Button'

export default function DetailsUtilisateurs() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [utilisateur, setUtilisateur] = useState(null)
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', telephone: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs/${id}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setUtilisateur(data)
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone ?? '',
        })
      })
      .catch(() => setError('Impossible de charger cet utilisateur.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaveMessage('')
    setSaveError('')
  }

  const handleSave = async () => {
    setSaveMessage('')
    setSaveError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/utilisateurs/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) { setSaveError(data.message || 'Une erreur est survenue.'); return }
      setUtilisateur(prev => ({ ...prev, ...data }))
      setSaveMessage('Modifications enregistrées avec succès.')
    } catch {
      setSaveError('Impossible de contacter le serveur.')
    }
  }

  if (loading) return <p className="details-loading">Chargement...</p>
  if (error) return <p className="details-loading">{error}</p>
  if (!utilisateur) return null

  return (
    <main className="details-page">
      <div className="details-back">
        <Button label="Retour" onClick={() => navigate('/admin/utilisateurs')} />
      </div>

      <h1 className="details-title">Détail utilisateur :</h1>

    

      <h2 className="details-subtitle">Informations personnelles :</h2>
      <section className="details-section">
        <div className="details-grid">
          <div className="details-field">
            <h3 className="details-label">Nom</h3>
            <input className="details-input" name="nom" value={formData.nom} onChange={handleChange} />
          </div>
          <div className="details-field">
            <h3 className="details-label">Prénom</h3>
            <input className="details-input" name="prenom" value={formData.prenom} onChange={handleChange} />
          </div>
          <div className="details-field">
            <h3 className="details-label">Email</h3>
            <input className="details-input" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="details-field">
            <h3 className="details-label">Téléphone</h3>
            <input className="details-input" name="telephone" value={formData.telephone} onChange={handleChange} />
          </div>
        </div>
      </section>

      <h2 className="details-subtitle details-subtitle--cycles">Cycles enregistrés :</h2>
      <section className="details-section details-section--compact">
        {utilisateur.cycles && utilisateur.cycles.length > 0 ? (
          <div className="details-cycles">
            {utilisateur.cycles.map(cycle => (
              <div key={cycle.id_cycle} className="details-cycle-card">
                <p className="details-cycle-ligne">{cycle.type_cycle.libelle} — {cycle.marque} ({cycle.annee})</p>
                {cycle.commentaire && (
                  <p className="details-cycle-commentaire">{cycle.commentaire}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="details-no-data">Aucun cycle enregistré.</p>
        )}
        <div className="details-cycle-btn">
          <Button label="Ajouter un nouveau cycle" />
        </div>
      </section>

      <h2 className="details-subtitle details-subtitle--cycles">Adresses :</h2>
      <section className="details-section details-section--compact">
        {utilisateur.adresse && utilisateur.adresse.length > 0 ? (
          <div className="details-cycles">
            {utilisateur.adresse.map(adr => (
              <div key={adr.id_adresse} className="details-cycle-card">
                <p className="details-cycle-ligne">{adr.numero_rue} {adr.rue}</p>
                {adr.complement_adresse && (
                  <p className="details-cycle-ligne">{adr.complement_adresse}</p>
                )}
                <p className="details-cycle-ligne">{adr.ville.code_postal} {adr.ville.nom_ville} — {adr.zone.nom_zone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="details-no-data">Aucune adresse enregistrée.</p>
        )}
        <div className="details-cycle-btn">
          <Button label="Ajouter une nouvelle adresse" />
        </div>
      </section>

      <div className="details-save">
        {saveMessage && <p className="details-save-success">{saveMessage}</p>}
        {saveError && <p className="details-save-error">{saveError}</p>}
        <button className="details-btn-save" onClick={handleSave}>
          Enregistrer les modifications
        </button>
      </div>
    </main>
  )
}
