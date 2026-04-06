import { Camera, ImageUp, ScanLine, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useProfiles } from '../context/ProfileContext'
import { scanBarcode, scanImage } from '../services/api'

export default function Scan() {
  const { selected } = useProfiles()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const mode = params.get('mode') || 'barcode'

  const [barcode, setBarcode] = useState('8901234567890')
  const [busy, setBusy] = useState(false)
  const [file, setFile] = useState(null)

  const profileLabel = useMemo(() => selected?.name || 'Selected profile', [selected?.name])

  async function onBarcode() {
    setBusy(true)
    try {
      const data = await scanBarcode(barcode)
      const product = data.product
      toast.success(`Scanned: ${product.name}`)
      nav('/loading', {
        state: { job: { source: 'barcode', product, allergies: selected?.allergies || [] } },
      })
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Barcode scan failed.')
    } finally {
      setBusy(false)
    }
  }

  async function onImage() {
    if (!file) return toast.error('Choose an image first.')
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const data = await scanImage(fd)
      const product = data.product
      toast.success(`Image read: ${product.name}`)
      nav('/loading', { state: { job: { source: 'image', product, allergies: selected?.allergies || [] } } })
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Image upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="text-sm font-semibold">Checking safety for</div>
        <div className="mt-1 text-xs text-ink-2">
          <span className="font-semibold text-ink-1">{profileLabel}</span> • Allergies:{' '}
          {selected?.allergies?.length ? selected.allergies.join(', ') : 'none'}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant={mode === 'barcode' ? 'primary' : 'secondary'}
            className="flex-1"
            onClick={() => nav('/scan?mode=barcode')}
          >
            <ScanLine className="h-5 w-5" /> Barcode
          </Button>
          <Button
            variant={mode === 'image' ? 'primary' : 'secondary'}
            className="flex-1"
            onClick={() => nav('/scan?mode=image')}
          >
            <ImageUp className="h-5 w-5" /> Image
          </Button>
        </div>
      </Card>

      {mode === 'barcode' ? (
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Barcode scan (placeholder)</div>
              <div className="mt-1 text-xs text-ink-2">
                Use a real scanner in production; this UI simulates scanning.
              </div>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 grid place-items-center">
              <Camera className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold text-ink-2 mb-2">Barcode</div>
            <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter barcode" />
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={onBarcode} disabled={busy}>
              {busy ? 'Scanning…' : 'Scan & Analyze'}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setBarcode(String(Date.now()))}>
              Random barcode
            </Button>
          </div>

          <div className="mt-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => nav('/search')}>
              <Search className="h-5 w-5" />
              Prefer search? Use smart product search
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="text-sm font-semibold">Upload product image</div>
          <div className="mt-1 text-xs text-ink-2">
            Upload a label photo; we’ll extract a product and analyze ingredients.
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-2xl file:border-0 file:px-4 file:py-2 file:bg-surface-2 file:text-ink-1 file:font-semibold hover:file:bg-surface-3"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={onImage} disabled={busy}>
              {busy ? 'Uploading…' : 'Upload & Analyze'}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setFile(null)}>
              Clear
            </Button>
          </div>

          <div className="mt-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => nav('/search')}>
              <Search className="h-5 w-5" />
              Or use smart product search
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

