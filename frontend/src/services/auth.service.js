const API_URL = 'http://localhost:3000/api/v1/auth'

export const register = async (nom, prenom, email, telephone, mot_de_passe, confirmer_mot_de_passe) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ nom, prenom, email, telephone, mot_de_passe, confirmer_mot_de_passe }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

export const login = async (email, mot_de_passe) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, mot_de_passe }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}
