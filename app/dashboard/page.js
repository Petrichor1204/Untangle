'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Check, LogOut, ExternalLink, Clock, DollarSign, AlertTriangle, ChevronRight, Scissors, Calendar } from 'lucide-react'
import api from '@/lib/api'

const STATUS_STYLES = {
  pending:        'bg-amber-50 text-amber-700 border-amber-200',
  reviewed:       'bg-blue-50 text-blue-700 border-blue-200',
  confirmed:      'bg-green-50 text-green-700 border-green-200',
  rescheduled:    'bg-purple-50 text-purple-700 border-purple-200',
  prep_requested: 'bg-orange-50 text-orange-700 border-orange-200',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [intakes, setIntakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const loadIntakes = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/intakes')
      setIntakes(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('untangle_user')
    if (!stored) { router.push('/login'); return }
    setUser(JSON.parse(stored))
    loadIntakes()
  }, [router, loadIntakes])

  const intakeLink = user?.slug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/intake/${user.slug}`
    : ''

  const copyLink = async () => {
    if (!intakeLink) return
    await navigator.clipboard.writeText(intakeLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const logout = () => {
    localStorage.removeItem('untangle_token')
    localStorage.removeItem('untangle_user')
    router.push('/')
  }

  if (!user) return null

  const submitted = intakes.filter(i => i.submitted)
  const pending = submitted.filter(i => i.status === 'pending')

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      {/* Header */}
      <header className="bg-white border-b border-warm-100 px-8 py-4 flex items-center justify-between shadow-warm">
        <span className="font-brand text-2xl text-warm-700">Untangle</span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/dashboard/services')}
            className="text-sm text-warm-500 hover:text-warm-800 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Scissors size={14} /> Services
          </button>
          <span className="text-sm text-warm-600 font-medium">{user.name}</span>
          <button
            onClick={logout}
            className="text-xs text-warm-400 hover:text-warm-700 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Intake link card */}
        <div className="bg-warm-700 rounded-3xl p-8 shadow-warm-md">
          <p className="text-warm-300 text-xs font-bold uppercase tracking-widest mb-2">
            Your intake link
          </p>
          <h2 className="font-display text-3xl text-warm-50 mb-5">
            Share this before every appointment.
          </h2>
          <div className="flex items-center gap-3 bg-warm-800 rounded-2xl px-5 py-3.5">
            <span className="text-sm text-warm-200 font-medium flex-1 truncate">{intakeLink}</span>
            <button onClick={copyLink} className="text-warm-400 hover:text-warm-100 transition-colors shrink-0" title="Copy link">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            <a href={intakeLink} target="_blank" rel="noreferrer"
              className="text-warm-400 hover:text-warm-100 transition-colors shrink-0" title="Preview">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total sent', value: intakes.length },
            { label: 'Submitted', value: submitted.length },
            { label: 'Need review', value: pending.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-warm-100 rounded-2xl p-6 text-center shadow-warm">
              <div className="font-display text-4xl text-warm-600 mb-1">{value}</div>
              <div className="text-xs text-warm-400 font-semibold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Intake list */}
        <div className="bg-white border border-warm-100 rounded-3xl overflow-hidden shadow-warm">
          <div className="px-8 py-5 border-b border-warm-100 flex items-center justify-between">
            <h2 className="font-display text-2xl text-warm-900">Client intakes</h2>
            {pending.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                <AlertTriangle size={12} /> {pending.length} to review
              </span>
            )}
          </div>

          {loading ? (
            <div className="px-8 py-16 text-center text-warm-400 text-sm">Loading…</div>
          ) : intakes.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <p className="font-display text-2xl text-warm-300 mb-2">No intakes yet.</p>
              <p className="text-warm-400 text-sm">
                Copy your link above and send it to your next client.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-warm-50">
              {intakes.map((intake) => (
                <button
                  key={intake.token}
                  onClick={() => router.push(`/dashboard/intake/${intake.token}`)}
                  className="w-full text-left px-8 py-5 hover:bg-warm-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-sm font-bold text-warm-900">{intake.client_name}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          intake.submitted
                            ? STATUS_STYLES[intake.status] || STATUS_STYLES.pending
                            : 'bg-warm-50 text-warm-400 border-warm-100'
                        }`}>
                          {intake.submitted ? intake.status.replace('_', ' ') : 'not submitted'}
                        </span>
                      </div>
                      <p className="text-xs text-warm-400">
                        {intake.service_name} · {intake.client_email}
                      </p>
                      {intake.estimate && (
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs font-semibold text-warm-600">
                            <Clock size={11} /> {intake.estimate.estimated_service_hours}h
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-warm-600">
                            <DollarSign size={11} />
                            ${intake.adjusted_price_min ?? intake.estimate.suggested_price_min}–${intake.adjusted_price_max ?? intake.estimate.suggested_price_max}
                          </span>
                          {intake.estimate.prep_time_minutes > 0 && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                              <AlertTriangle size={11} /> +{intake.estimate.prep_time_minutes}m prep
                            </span>
                          )}
                          <span className="text-xs text-warm-300 font-medium">
                            score {intake.estimate.complexity_score}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {intake.appointment_at ? (
                        <span className="flex items-center gap-1 text-xs text-warm-500 font-semibold">
                          <Calendar size={11} className="text-warm-400" />
                          {new Date(intake.appointment_at).toLocaleString([], {
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-warm-300">no time set</span>
                      )}
                      <ChevronRight size={14} className="text-warm-300" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
