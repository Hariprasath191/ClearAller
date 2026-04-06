import { Plus, Save, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useProfiles } from '../context/ProfileContext'

const SUGGESTED = ['milk', 'peanut', 'gluten', 'egg', 'soy', 'tree nuts', 'sesame', 'shellfish']

function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
}

export default function Profile() {
  const { profiles, selected, setSelectedId, addProfile, updateAllergies, loading } = useProfiles()
  const [newProfileName, setNewProfileName] = useState('')
  const [allergyInput, setAllergyInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(() => [])

  const currentAllergies = useMemo(() => selected?.allergies || [], [selected])

  useEffect(() => {
    setDraft(currentAllergies)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id])

  async function onAddProfile() {
    const name = newProfileName.trim()
    if (!name) return toast.error('Enter a profile name.')
    try {
      await addProfile(name)
      toast.success('Profile created.')
      setNewProfileName('')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not create profile.')
    }
  }

  function addAllergy(a) {
    const v = norm(a)
    if (!v) return
    setDraft((prev) => (prev.includes(v) ? prev : [...prev, v]))
    setAllergyInput('')
  }

  function removeAllergy(a) {
    setDraft((prev) => prev.filter((x) => x !== a))
  }

  async function onSave() {
    if (!selected?.id) return
    setSaving(true)
    try {
      await updateAllergies(selected.id, draft)
      toast.success('Allergies saved.')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save allergies.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="text-sm font-semibold">Family profiles</div>
        <div className="mt-1 text-xs text-ink-2">
          Create separate profiles to check safety for each family member.
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Add new profile (e.g., Dad)"
          />
          <Button variant="primary" size="icon" onClick={onAddProfile} disabled={loading}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={[
                'px-3 py-2 rounded-2xl text-sm font-semibold border transition',
                p.id === selected?.id
                  ? 'bg-surface-2 border-black/10 dark:border-white/10 text-ink-1'
                  : 'bg-transparent border-black/5 dark:border-white/10 text-ink-2 hover:bg-surface-2',
              ].join(' ')}
            >
              {p.name}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Allergy management</div>
            <div className="mt-1 text-xs text-ink-2">
              Add allergens for <span className="font-semibold text-ink-1">{selected?.name || '—'}</span>.
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onSave} disabled={saving || !selected}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="Type an allergen (e.g., peanut)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addAllergy(allergyInput)
              }
            }}
          />
          <Button variant="primary" size="icon" onClick={() => addAllergy(allergyInput)} disabled={!selected}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((a) => (
            <button
              key={a}
              onClick={() => addAllergy(a)}
              className="text-xs font-semibold px-3 py-2 rounded-2xl bg-surface-1 border border-black/5 dark:border-white/10 text-ink-2 hover:bg-surface-2 transition"
            >
              + {a}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {draft.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 text-sm font-semibold"
            >
              {a}
              <button onClick={() => removeAllergy(a)} aria-label={`Remove ${a}`}>
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          {!draft.length ? <div className="text-sm text-ink-2">No allergens added yet.</div> : null}
        </div>
      </Card>
    </div>
  )
}

