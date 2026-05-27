import { useEffect, useState } from 'react'
import '../../styles/client/Profile.css'
import Button from '../../components/Button'

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

export default function Profile() {
  const [profil, setProfil] = useState(null)
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', telephone: '' })
  const [cyclesData, setCyclesData] = useState([])
  const [editingNomIds, setEditingNomIds] = useState(new Set())
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [showAddCycle, setShowAddCycle] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/client/profil`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/client/types-cycles`, { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([profilData, typesData]) => {
        setProfil(profilData)
        setFormData({ nom: profilData.nom, prenom: profilData.prenom, email: profilData.email, telephone: profilData.telephone ?? '' })
        setCyclesData(profilData.cycles.map(c => ({
          id_cycle: c.id_cycle,
          nom: c.nom,
          marque: c.marque,
          annee: c.annee,
          id_type_cycle: c.id_type_cycle,
          commentaire: c.commentaire ?? '',
          type_cycle: c.type_cycle,
        })))
        setTypes(typesData)
      })
      .catch(() => setError('Impossible de charger le profil.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaveMessage('')
    setSaveError('')
  }

  const handleCycleChange = (id, field, value) => {
    setCyclesData(prev => prev.map(c => c.id_cycle === id ? { ...c, [field]: value } : c))
    setSaveMessage('')
    setSaveError('')
  }

  const toggleEditNom = (id) => {
    setEditingNomIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteCycle = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/cycles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) return
      setCyclesData(prev => prev.filter(c => c.id_cycle !== id))
      setProfil(prev => ({ ...prev, cycles: prev.cycles.filter(c => c.id_cycle !== id) }))
    } catch {
      // silently fail
    }
  }

  const handleSave = async () => {
    setSaveMessage('')
    setSaveError('')
    try {
      const requests = [
        fetch(`${import.meta.env.VITE_API_URL}/client/profil`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        ...cyclesData.map(c =>
          fetch(`${import.meta.env.VITE_API_URL}/client/cycles/${c.id_cycle}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom: c.nom, marque: c.marque, annee: c.annee, id_type_cycle: c.id_type_cycle, commentaire: c.commentaire }),
          })
        ),
      ]

      const responses = await Promise.all(requests)
      const failed = responses.find(r => !r.ok)
      if (failed) {
        const err = await failed.json()
        setSaveError(err.message || 'Une erreur est survenue.')
        return
      }

      setEditingNomIds(new Set())
      setSaveMessage('Modifications enregistrées avec succès.')
    } catch {
      setSaveError('Impossible de contacter le serveur.')
    }
  }

  const handleAddCycle = (newCycle) => {
    const entry = {
      id_cycle: newCycle.id_cycle,
      nom: newCycle.nom,
      marque: newCycle.marque,
      annee: newCycle.annee,
      id_type_cycle: newCycle.id_type_cycle,
      commentaire: newCycle.commentaire ?? '',
      type_cycle: newCycle.type_cycle,
    }
    setCyclesData(prev => [...prev, entry])
    setProfil(prev => ({ ...prev, cycles: [...prev.cycles, newCycle] }))
  }

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
            <input className="profile-input" name="nom" value={formData.nom} onChange={handleChange} />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Prénom</h3>
            <input className="profile-input" name="prenom" value={formData.prenom} onChange={handleChange} />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Email</h3>
            <input className="profile-input" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="profile-field">
            <h3 className="profile-info">Téléphone</h3>
            <input className="profile-input" name="telephone" value={formData.telephone} onChange={handleChange} />
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
        {cyclesData.length > 0 ? (
          <div className="profile-cycles">
            {cyclesData.map(cycle => (
              <div key={cycle.id_cycle} className="profile-cycle-item">
                <div className="profile-cycle-header">
                  {editingNomIds.has(cycle.id_cycle) ? (
                    <input
                      className="profile-input profile-cycle-nom-input"
                      value={cycle.nom}
                      onChange={e => handleCycleChange(cycle.id_cycle, 'nom', e.target.value)}
                    />
                  ) : (
                    <p className="profile-cycle-nom">{cycle.nom}</p>
                  )}
                  <div className="profile-cycle-actions">
                    <button className="profile-cycle-btn modifier" onClick={() => toggleEditNom(cycle.id_cycle)}>
                      {editingNomIds.has(cycle.id_cycle) ? 'Valider' : 'Modifier'}
                    </button>
                    <button className="profile-cycle-btn supprimer" onClick={() => handleDeleteCycle(cycle.id_cycle)}>
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="profile-grid profile-cycle-grid">
                  <div className="profile-field">
                    <h3 className="profile-info">Marque</h3>
                    <input className="profile-input" value={cycle.marque} onChange={e => handleCycleChange(cycle.id_cycle, 'marque', e.target.value)} />
                  </div>
                  <div className="profile-field">
                    <h3 className="profile-info">Année</h3>
                    <input className="profile-input" type="number" value={cycle.annee} onChange={e => handleCycleChange(cycle.id_cycle, 'annee', e.target.value)} />
                  </div>
                  <div className="profile-field">
                    <h3 className="profile-info">Type</h3>
                    <select className="profile-input" value={cycle.id_type_cycle} onChange={e => handleCycleChange(cycle.id_cycle, 'id_type_cycle', e.target.value)}>
                      {types.map(t => (
                        <option key={t.id_type_cycle} value={t.id_type_cycle}>{t.libelle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="profile-field">
                    <h3 className="profile-info">Commentaire</h3>
                    <textarea className="profile-input profile-input--textarea" value={cycle.commentaire} onChange={e => handleCycleChange(cycle.id_cycle, 'commentaire', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-no-adresse">Aucun cycle enregistré.</p>
        )}
        <div className="profile-adresse-btn">
          <Button label="Ajouter un nouveau cycle" onClick={() => setShowAddCycle(true)} />
        </div>
      </section>

      <div className="profile-save-btn">
        {saveMessage && <p className="profile-save-success">{saveMessage}</p>}
        {saveError && <p className="profile-save-error">{saveError}</p>}
        <Button label="Enregistrer les modifications" onClick={handleSave} />
      </div>

      <div className="profile-delete-btn">
        <Button label="Supprimer mon compte" />
      </div>

      {showAddCycle && (
        <AddCycleModal
          types={types}
          onClose={() => setShowAddCycle(false)}
          onAdd={handleAddCycle}
        />
      )}
    </main>
  )
}
