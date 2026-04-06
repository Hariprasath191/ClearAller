import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createProfile, getProfiles, setProfileAllergies } from '../services/api'
import { useAuth } from './AuthContext'

const ProfileContext = createContext(null)

const SELECTED_KEY = 'cv_selected_profile'

export function ProfileProvider({ children }) {
  const { isAuthed } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem(SELECTED_KEY) || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProfiles()
      const list = data.profiles || data || []
      setProfiles(list)
      if (!selectedId && list[0]?.id) setSelectedId(list[0].id)
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load profiles.')
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  useEffect(() => {
    if (!isAuthed) {
      setProfiles([])
      setError(null)
      setLoading(false)
      return
    }
    refresh()
  }, [isAuthed, refresh])

  useEffect(() => {
    if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId)
  }, [selectedId])

  const selected = useMemo(
    () => profiles.find((p) => p.id === selectedId) || profiles[0] || null,
    [profiles, selectedId],
  )

  const value = useMemo(
    () => ({
      profiles,
      selected,
      selectedId: selected?.id || '',
      setSelectedId,
      loading,
      error,
      refresh,
      async addProfile(name) {
        const data = await createProfile({ name })
        const p = data.profile || data
        setProfiles((prev) => [p, ...prev])
        setSelectedId(p.id)
        return p
      },
      async updateAllergies(profileId, allergies) {
        const data = await setProfileAllergies(profileId, { allergies })
        const updated = data.profile || data
        setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        return updated
      },
    }),
    [profiles, selected, loading, error, refresh],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfiles() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfiles must be used within ProfileProvider')
  return ctx
}

