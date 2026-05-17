'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Check } from 'lucide-react'
import api from '@/lib/api'

const DEFAULT_SERVICES = [
  { name: 'Knotless Braids', base_price: 180, base_time_hours: 5, description: '' },
  { name: 'Box Braids', base_price: 160, base_time_hours: 4, description: '' },
  { name: 'Silk Press', base_price: 85, base_time_hours: 2, description: '' },
  { name: 'Wash & Style', base_price: 65, base_time_hours: 1.5, description: '' },
  { name: 'Loc Retwist', base_price: 75, base_time_hours: 2, description: '' },
  { name: 'Sew-In Weave', base_price: 150, base_time_hours: 3, description: '' },
]

const EMPTY = { name: '', base_price: '', base_time_hours: '', description: '' }

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [services, setServices] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('untangle_user')
    if (!stored) { router.push('/login'); return }
    setUser(JSON.parse(stored))
  }, [router])

  const addService = () => {
    if (!form.name.trim() || !form.base_price || !form.base_time_hours) {
      setError('Name, price, and estimated hours are all required.')
      return
    }
    setError('')
    setServices([...services, {
      name: form.name.trim(),
      base_price: parseFloat(form.base_price),
      base_time_hours: parseFloat(form.base_time_hours),
      description: form.description.trim(),
    }])
    setForm(EMPTY)
  }

  const addDefault = (svc) => {
    if (!services.find(s => s.name === svc.name)) setServices([...services, svc])
  }

  const remove = (i) => setServices(services.filter((_, idx) => idx !== i))

  const handleDone = async () => {
    if (services.length === 0) { setError('Add at least one service to continue.'); return }
    setError('')
    setSaving(true)
    try {
      for (const svc of services) await api.post('/services', svc)
      router.push('/dashboard')
    } catch {
      setError('Could not save services. Please try again.')
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-warm-50 py-16 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-10">
          <span className="font-brand text-3xl text-warm-700 block mb-5">Untangle</span>
          <h1 className="font-display text-5xl text-warm-900 mb-3">What do you offer?</h1>
          <p className="text-warm-500 text-sm leading-relaxed">
            Clients will choose from these when filling out their intake form.
            You can always edit them from your dashboard.
          </p>
        </div>

        {/* Quick-add */}
        <div className="bg-white border border-warm-200 rounded-3xl p-6 mb-4 shadow-warm">
          <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-4">
            Quick-add common services
          </p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SERVICES.map((svc) => {
              const added = services.find(s => s.name === svc.name)
              return (
                <button
                  key={svc.name}
                  onClick={() => addDefault(svc)}
                  className={`text-xs px-3.5 py-2 rounded-full border font-semibold transition-all ${
                    added
                      ? 'bg-warm-100 border-warm-400 text-warm-700'
                      : 'border-warm-200 text-warm-600 hover:border-warm-400 hover:bg-warm-50'
                  }`}
                >
                  {added
                    ? <><Check size={10} className="inline mr-1" />{svc.name}</>
                    : `+ ${svc.name}`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom service */}
        <div className="bg-white border border-warm-200 rounded-3xl p-6 mb-4 shadow-warm">
          <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-4">
            Add a custom service
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Service name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
              />
            </div>
            <input
              type="number" placeholder="Base price ($)" min="0" step="5"
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              className="border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
            />
            <input
              type="number" placeholder="Est. hours" min="0.5" step="0.5"
              value={form.base_time_hours}
              onChange={(e) => setForm({ ...form, base_time_hours: e.target.value })}
              className="border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
            />
          </div>
          <button
            onClick={addService}
            className="flex items-center gap-1.5 text-sm bg-warm-100 text-warm-700 px-4 py-2 rounded-xl hover:bg-warm-200 transition-colors font-semibold border border-warm-200"
          >
            <Plus size={14} /> Add service
          </button>
        </div>

        {/* Service list */}
        {services.length > 0 && (
          <div className="bg-white border border-warm-200 rounded-3xl p-6 mb-4 shadow-warm">
            <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-4">
              Your services ({services.length})
            </p>
            <div className="space-y-2">
              {services.map((svc, i) => (
                <div key={i} className="flex items-center justify-between bg-warm-50 border border-warm-100 rounded-2xl px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-warm-900">{svc.name}</span>
                    <span className="text-xs text-warm-400 ml-2">
                      ${svc.base_price} · {svc.base_time_hours}h
                    </span>
                  </div>
                  <button onClick={() => remove(i)} className="text-warm-300 hover:text-warm-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-3 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleDone}
          disabled={saving || services.length === 0}
          className="w-full bg-warm-700 text-warm-50 font-semibold py-4 rounded-2xl hover:bg-warm-800 transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Go to my dashboard →'}
        </button>
        <p className="text-xs text-center text-warm-400 mt-3">
          Services can be edited at any time from your dashboard.
        </p>
      </div>
    </div>
  )
}
