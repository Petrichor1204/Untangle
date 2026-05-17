'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import api from '@/lib/api'

const EMPTY_FORM = { name: '', base_price: '', base_time_hours: '', description: '' }

function ServiceForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const valid = form.name.trim() && parseFloat(form.base_price) > 0 && parseFloat(form.base_time_hours) > 0

  return (
    <div className="bg-warm-50 border border-warm-200 rounded-2xl p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Service name</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Box braids"
            className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Base price ($)</label>
          <input
            type="number"
            value={form.base_price}
            onChange={e => set('base_price', e.target.value)}
            placeholder="150"
            className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Base time (hours)</label>
          <input
            type="number"
            step="0.5"
            value={form.base_time_hours}
            onChange={e => set('base_time_hours', e.target.value)}
            placeholder="3"
            className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300 bg-white"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Description (optional)</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Short description shown to clients"
            className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300 bg-white resize-none"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          disabled={!valid || saving}
          onClick={() => onSave({
            name: form.name.trim(),
            base_price: parseFloat(form.base_price),
            base_time_hours: parseFloat(form.base_time_hours),
            description: form.description.trim() || null,
          })}
          className="flex items-center gap-1.5 bg-warm-700 hover:bg-warm-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl px-4 py-2 transition-colors"
        >
          <Check size={13} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-warm-400 hover:text-warm-700 text-xs font-semibold px-3 py-2 transition-colors"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('hairly_user')
    if (!stored) { router.push('/login'); return }
    load()
  }, [router])

  async function load() {
    try {
      const r = await api.get('/services')
      setServices(r.data)
    } finally {
      setLoading(false)
    }
  }

  async function addService(data) {
    setSaving(true)
    try {
      await api.post('/services', data)
      setShowAdd(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function updateService(id, data) {
    setSaving(true)
    try {
      await api.put(`/services/${id}`, data)
      setEditingId(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function deleteService(id) {
    if (!confirm('Delete this service? Any linked intakes will lose their service reference.')) return
    setSaving(true)
    try {
      await api.delete(`/services/${id}`)
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      <header className="bg-white border-b border-warm-100 px-6 py-4 flex items-center gap-4 shadow-warm">
        <button onClick={() => router.push('/dashboard')} className="text-warm-400 hover:text-warm-700 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-xl text-warm-900 flex-1">Services</h1>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null) }}
          className="flex items-center gap-1.5 bg-warm-700 hover:bg-warm-800 text-white text-xs font-semibold rounded-xl px-4 py-2 transition-colors"
        >
          <Plus size={13} /> Add service
        </button>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-4">

        {showAdd && (
          <ServiceForm
            onSave={addService}
            onCancel={() => setShowAdd(false)}
            saving={saving}
          />
        )}

        {loading ? (
          <p className="text-center text-warm-400 text-sm py-16">Loading…</p>
        ) : services.length === 0 && !showAdd ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-warm-300 mb-2">No services yet.</p>
            <p className="text-warm-400 text-sm">Add your first service to start sending intake forms.</p>
          </div>
        ) : (
          services.map(svc => (
            <div key={svc.id} className="bg-white border border-warm-100 rounded-3xl overflow-hidden shadow-warm">
              {editingId === svc.id ? (
                <div className="p-5">
                  <ServiceForm
                    initial={{
                      name: svc.name,
                      base_price: String(svc.base_price),
                      base_time_hours: String(svc.base_time_hours),
                      description: svc.description ?? '',
                    }}
                    onSave={data => updateService(svc.id, data)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </div>
              ) : (
                <div className="px-6 py-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-warm-900">{svc.name}</p>
                    {svc.description && (
                      <p className="text-xs text-warm-400 mt-0.5 line-clamp-2">{svc.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-warm-600 font-semibold">${svc.base_price} base</span>
                      <span className="text-xs text-warm-400">{svc.base_time_hours}h base time</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingId(svc.id)}
                      className="text-warm-300 hover:text-warm-600 transition-colors p-1"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteService(svc.id)}
                      className="text-warm-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

      </main>
    </div>
  )
}
