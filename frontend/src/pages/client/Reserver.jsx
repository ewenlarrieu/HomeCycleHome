import { useEffect, useState } from 'react'
import '../../styles/client/Reserver.css'

export default function Reserver() {
  const [forfaits, setForfaits] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/client/forfaits`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setForfaits(data))
      .catch(() => setError('Impossible de charger les forfaits.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="reserver-loading">Chargement...</p>
  if (error) return <p className="reserver-loading">{error}</p>

  return (
    <main className="reserver-page">
      <h1 className="reserver-title">Prise de rendez-vous</h1>

      <h2 className="reserver-subtitle">Choisissez le type , la date et l’heure</h2>

      <div className="reserver-container">
        <div className="reserver-step-header">
          <span className="reserver-step-number">1</span>
          <span className="reserver-step-label">Type d'intervention</span>
        </div>
        <div className="reserver-grid">
          {forfaits.map(forfait => (
            <div
              key={forfait.id_service}
              className={`reserver-card ${selected === forfait.id_service ? 'selected' : ''}`}
              onClick={() => setSelected(forfait.id_service)}
            >
              <h3 className="reserver-card-nom">{forfait.nom_service}</h3>
              <p className="reserver-card-description">{forfait.description}</p>
              <div className="reserver-card-footer">
                <span className="reserver-card-prix">{parseFloat(forfait.prix).toFixed(2)} €</span>
                {forfait.duree_estimee_minutes && (
                  <span className="reserver-card-duree">{forfait.duree_estimee_minutes} min</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
