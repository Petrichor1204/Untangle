'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'
import api from '@/lib/api'

export default function StylePickerPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [stylist, setStylist] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ client_name: '', client_email: '', service_id: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/stylist/${slug}`)
      .then(res => setStylist(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const handleStart = async (e) => {
    e.preventDefault()
    if (!form.service_id) { setError('Please choose a service to continue.'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post(`/intake/${slug}/start`, form)
      router.push(`/intake/${slug}/${res.data.token}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not start. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center">
      <span className="text-warm-400 text-sm">Loading…</span>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4 text-center">
      <span className="font-brand text-3xl text-warm-600 mb-6">Hairly</span>
      <h1 className="font-display text-3xl text-warm-900 mb-2">Stylist not found.</h1>
      <p className="text-sm text-warm-400">Double-check the link you were sent.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      {/* Warm header band */}
      <div className="bg-warm-700 px-8 py-6">
        <div className="max-w-lg mx-auto">
          <span className="font-brand text-2xl text-warm-100 block mb-3">Hairly</span>
          <p className="text-warm-300 text-xs font-semibold uppercase tracking-widest mb-1">
            You're booking with
          </p>
          <h1 className="font-display text-4xl text-warm-50 mb-1">{stylist.name}</h1>
          {stylist.location && (
            <p className="text-warm-300 text-sm">{stylist.location}</p>
          )}
        </div>
      </div>

      {/* Warm info bar */}
      <div className="bg-warm-100 border-b border-warm-200 px-8 py-4">
        <p className="max-w-lg mx-auto text-sm text-warm-600 leading-relaxed">
          Fill out this short form before your appointment — it helps your stylist
          come fully prepared so your time together goes smoothly.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        <form onSubmit={handleStart} className="space-y-8">

          {/* Client details */}
          <div className="bg-white border border-warm-100 rounded-3xl p-7 shadow-warm">
            <h2 className="font-display text-2xl text-warm-900 mb-5">Your information</h2>
            <div className="space-y-4">
              {[
                { field: 'client_name', label: 'Full name', type: 'text', placeholder: 'Maya Johnson' },
                { field: 'client_email', label: 'Email', type: 'email', placeholder: 'maya@example.com' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Service selection */}
          <div className="bg-white border border-warm-100 rounded-3xl p-7 shadow-warm">
            <h2 className="font-display text-2xl text-warm-900 mb-5">Choose your service</h2>
            {stylist.services.length === 0 ? (
              <p className="text-sm text-warm-400">This stylist hasn't added services yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stylist.services.map((svc) => (
                  <label
                    key={svc.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.service_id === svc.id
                        ? 'border-warm-500 bg-warm-50'
                        : 'border-warm-100 hover:border-warm-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        form.service_id === svc.id ? 'border-warm-500' : 'border-warm-200'
                      }`}>
                        {form.service_id === svc.id && (
                          <div className="w-2 h-2 rounded-full bg-warm-500" />
                        )}
                      </div>
                      <input type="radio" name="service" value={svc.id}
                        checked={form.service_id === svc.id}
                        onChange={() => setForm({ ...form, service_id: svc.id })}
                        className="sr-only" />
                      <div>
                        <div className="text-sm font-bold text-warm-900">{svc.name}</div>
                        {svc.description && <div className="text-xs text-warm-400 mt-0.5">{svc.description}</div>}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-sm font-bold text-warm-700">from ${svc.base_price}</div>
                      <div className="flex items-center justify-end gap-1 text-xs text-warm-400">
                        <Clock size={10} /> ~{svc.base_time_hours}h
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || stylist.services.length === 0}
            className="w-full bg-warm-700 text-warm-50 font-semibold py-4 rounded-2xl hover:bg-warm-800 transition-colors disabled:opacity-40"
          >
            {submitting ? 'Starting…' : 'Begin my hair consultation →'}
          </button>
          <p className="text-xs text-center text-warm-400">
            About 3 minutes. Your stylist reviews this before confirming your appointment.
          </p>
        </form>
      </div>
    </div>
  )
}
