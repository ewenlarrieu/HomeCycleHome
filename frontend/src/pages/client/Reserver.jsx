import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/client/Reserver.css'
import '../../styles/client/Profile.css'
import Button from '../../components/Button'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

function AddAdresseModal({ zones, onClose, onAdd }) {
  const [form, setForm] = useState({ numero_rue: '', rue: '', complement_adresse: '', id_zone: zones[0]?.id_zone ?? '' })
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/adresses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Une erreur est survenue.'); return }
      onAdd(data)
      onClose()
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <h3 className="profile-modal-title">Ajouter une adresse</h3>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Numéro</label>
          <input className="profile-modal-input" name="numero_rue" type="number" value={form.numero_rue} onChange={handleChange} placeholder="Ex : 12" />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Rue</label>
          <input className="profile-modal-input" name="rue" value={form.rue} onChange={handleChange} placeholder="Ex : Rue de la Paix" />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Complément <span className="profile-modal-optional">(optionnel)</span></label>
          <input className="profile-modal-input" name="complement_adresse" value={form.complement_adresse} onChange={handleChange} placeholder="Ex : Bât. B, Apt. 3" />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Arrondissement</label>
          <select className="profile-modal-select" name="id_zone" value={form.id_zone} onChange={handleChange}>
            {zones.map(z => (
              <option key={z.id_zone} value={z.id_zone}>{z.nom_zone} ({z.code_postal})</option>
            ))}
          </select>
        </div>
        {error && <p className="profile-modal-error">{error}</p>}
        <div className="profile-modal-footer">
          <button className="profile-modal-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="profile-modal-btn-confirm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AddCycleModal({ types, onClose, onAdd }) {
  const [form, setForm] = useState({ nom: '', marque: '', annee: '', id_type_cycle: types[0]?.id_type_cycle ?? '', commentaire: '' })
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/cycles`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Une erreur est survenue.'); return }
      onAdd(data)
      onClose()
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <h3 className="profile-modal-title">Ajouter un cycle</h3>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Nom</label>
          <input className="profile-modal-input" name="nom" value={form.nom} onChange={handleChange} placeholder="Ex : Mon vélo du dimanche" />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Marque</label>
          <input className="profile-modal-input" name="marque" value={form.marque} onChange={handleChange} placeholder="Ex : Trek, Décathlon..." />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Année</label>
          <input className="profile-modal-input" name="annee" type="number" value={form.annee} onChange={handleChange} placeholder="Ex : 2020" />
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Type</label>
          <select className="profile-modal-select" name="id_type_cycle" value={form.id_type_cycle} onChange={handleChange}>
            {types.map(t => (
              <option key={t.id_type_cycle} value={t.id_type_cycle}>{t.libelle}</option>
            ))}
          </select>
        </div>
        <div className="profile-modal-field">
          <label className="profile-modal-label">Commentaire <span className="profile-modal-optional">(optionnel)</span></label>
          <input className="profile-modal-input" name="commentaire" value={form.commentaire} onChange={handleChange} placeholder="Ex : Cadre aluminium, vitesses..." />
        </div>
        {error && <p className="profile-modal-error">{error}</p>}
        <div className="profile-modal-footer">
          <button className="profile-modal-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="profile-modal-btn-confirm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Reserver() {
  const [forfaits, setForfaits] = useState([])
  const [creneaux, setCreneaux] = useState([])
  const [adresses, setAdresses] = useState([])
  const [cycles, setCycles] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedCreneau, setSelectedCreneau] = useState(null)
  const [selectedAdresse, setSelectedAdresse] = useState(null)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [zones, setZones] = useState([])
  const [types, setTypes] = useState([])
  const [showAddAdresse, setShowAddAdresse] = useState(false)
  const [showAddCycle, setShowAddCycle] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loadingCreneaux, setLoadingCreneaux] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/client/forfaits`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/client/profil`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/client/zones`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/client/types-cycles`, { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([forfaitsData, profilData, zonesData, typesData]) => {
        setForfaits(forfaitsData)
        setAdresses(profilData.adresse || [])
        setCycles(profilData.cycles || [])
        setZones(zonesData)
        setTypes(typesData)
      })
      .catch(() => setError('Impossible de charger les données.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedAdresse) return
    setLoadingCreneaux(true)
    setSelectedCreneau(null)
    const idZone = selectedAdresse.zone?.id_zone ?? ''
    fetch(`${import.meta.env.VITE_API_URL}/client/creneaux?id_zone=${idZone}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCreneaux(data))
      .catch(() => setCreneaux([]))
      .finally(() => setLoadingCreneaux(false))
  }, [selectedAdresse])

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
      <div className="reserver-container reserver-container--top">
        <div className="reserver-step-header">
          <span className="reserver-step-number">2</span>
          <span className="reserver-step-label">Choisissez une adresse</span>
        </div>
        {adresses.length === 0 ? (
          <p className="reserver-empty">Aucune adresse enregistrée.</p>
        ) : (
          <div className="reserver-adresse-list">
            {adresses.map(adresse => (
              <div
                key={adresse.id_adresse}
                className={`reserver-adresse-card ${selectedAdresse?.id_adresse === adresse.id_adresse ? 'selected' : ''}`}
                onClick={() => setSelectedAdresse(adresse)}
              >
                <p className="reserver-adresse-rue">{adresse.numero_rue} {adresse.rue}{adresse.complement_adresse ? `, ${adresse.complement_adresse}` : ''}</p>
                <p className="reserver-adresse-ville">{adresse.ville.code_postal} {adresse.ville.nom_ville} — {adresse.zone.nom_zone}</p>
              </div>
            ))}
          </div>
        )}
        <div className="reserver-adresse-footer">
          <Button label="Ajouter une nouvelle adresse" onClick={() => setShowAddAdresse(true)} />
        </div>
      </div>

      <div className="reserver-container reserver-container--top">
        <div className="reserver-step-header">
          <span className="reserver-step-number">3</span>
          <span className="reserver-step-label">Choisissez un créneau</span>
        </div>
        {!selectedAdresse ? (
          <p className="reserver-empty">Sélectionnez d'abord une adresse pour voir les créneaux disponibles.</p>
        ) : loadingCreneaux ? (
          <p className="reserver-empty">Chargement des créneaux...</p>
        ) : creneaux.length === 0 ? (
          <p className="reserver-empty">Aucun créneau disponible dans votre zone pour le moment.</p>
        ) : (
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
            locale={frLocale}
            events={creneaux.map(c => ({
              ...c,
              backgroundColor: selectedCreneau?.id === c.id ? '#030229' : '#48CAE4',
              borderColor: selectedCreneau?.id === c.id ? '#030229' : '#48CAE4',
            }))}
            eventClick={({ event }) => {
              const creneau = creneaux.find(c => String(c.id) === event.id)
              setSelectedCreneau(creneau)
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: isMobile ? 'timeGridDay' : 'timeGridWeek,timeGridDay',
            }}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            height="auto"
            validRange={{ start: new Date().toISOString().split('T')[0] }}
          />
        )}
        {selectedCreneau && (
          <p className="reserver-creneau-selected">
            Créneau sélectionné : <strong>{new Date(selectedCreneau.start).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</strong>
          </p>
        )}
      </div>

      <div className="reserver-container reserver-container--top">
        <div className="reserver-step-header">
          <span className="reserver-step-number">4</span>
          <span className="reserver-step-label">Choisissez un cycle</span>
        </div>
        {cycles.length === 0 ? (
          <p className="reserver-empty">Aucun cycle enregistré.</p>
        ) : (
          <div className="reserver-cycle-list">
            {cycles.map(cycle => (
              <div
                key={cycle.id_cycle}
                className={`reserver-cycle-card ${selectedCycle?.id_cycle === cycle.id_cycle ? 'selected' : ''}`}
                onClick={() => setSelectedCycle(cycle)}
              >
                <p className="reserver-cycle-nom">{cycle.nom}</p>
                <p className="reserver-cycle-details">{cycle.marque} · {cycle.annee} · {cycle.type_cycle.libelle}</p>
              </div>
            ))}
          </div>
        )}
        <div className="reserver-adresse-footer">
          <Button label="Ajouter un nouveau cycle" onClick={() => setShowAddCycle(true)} />
        </div>
      </div>

      <div className="reserver-container reserver-container--top">
        <div className="reserver-step-header">
          <span className="reserver-step-number">5</span>
          <span className="reserver-step-label">Commentaire</span>
        </div>
        <textarea
          className="reserver-commentaire"
          placeholder="Laissez une note pour le technicien (facultatif)..."
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)}
        />
      </div>

      {submitted && (!selected || !selectedAdresse || !selectedCreneau || !selectedCycle) && (
        <p className="reserver-submit-error">
          Veuillez sélectionner un type d'intervention, une adresse, un créneau et un cycle avant de continuer.
        </p>
      )}

      <div className="reserver-submit">
        <Button
          label="Suivant"
          onClick={() => {
            setSubmitted(true)
            if (!selected || !selectedAdresse || !selectedCreneau || !selectedCycle) return
            navigate('/client/recapitulatif', {
              state: {
                forfait: forfaits.find(f => f.id_service === selected) || null,
                adresse: selectedAdresse,
                creneau: selectedCreneau,
                cycle: selectedCycle,
                commentaire,
              }
            })
          }}
        />
      </div>

      {showAddAdresse && zones.length > 0 && (
        <AddAdresseModal
          zones={zones}
          onClose={() => setShowAddAdresse(false)}
          onAdd={(newAdresse) => {
            setAdresses(prev => [...prev, newAdresse])
            setShowAddAdresse(false)
          }}
        />
      )}

      {showAddCycle && types.length > 0 && (
        <AddCycleModal
          types={types}
          onClose={() => setShowAddCycle(false)}
          onAdd={(newCycle) => {
            setCycles(prev => [...prev, newCycle])
            setShowAddCycle(false)
          }}
        />
      )}
    </main>
  )
}
