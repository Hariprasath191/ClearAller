import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Loader } from '../components/Loader'
import { analyzeProduct } from '../services/api'
import { useProfiles } from '../context/ProfileContext'

export default function Loading() {
  const loc = useLocation()
  const nav = useNavigate()
  const { selected } = useProfiles()
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function run() {
      const job = loc.state?.job
      if (!job) return nav('/dashboard', { replace: true })
      try {
        const analysis = await analyzeProduct({
          product_id: job.product?.id,
          product_name: job.product?.name,
          ingredients_text: job.product?.ingredients,
          user_allergies: job.allergies || selected?.allergies || [],
        })
        if (!alive) return
        nav('/result', { replace: true, state: { analysis, source: job.source || 'analysis' } })
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Analysis failed.'
        if (!alive) return
        setError(msg)
        toast.error(msg)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [loc.state, nav, selected?.allergies])

  return (
    <div className="pt-6">
      <Card className="p-5">
        <Loader />
        {error ? (
          <div className="mt-2 text-center text-sm text-red-600 dark:text-red-300">{error}</div>
        ) : null}
      </Card>
    </div>
  )
}

