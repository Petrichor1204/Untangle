'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Clock, DollarSign, AlertTriangle, CheckCircle,
  Calendar, Droplets, Scissors, X, Send,
} from 'lucide-react'
import api from '@/lib/api'

const STATUS_STYLES = {
  pending:        'bg-amber-50 text-amber-700 border-amber-200',
  reviewed:       'bg-blue-50 text-blue-700 border-blue-200',
  confirmed:      'bg-green-50 text-green-700 border-green-200',
  rescheduled:    'bg-purple-50 text-purple-700 border-purple-200',
  prep_requested: 'bg-orange-50 text-orange-700 border-orange-200',
}

const FIELD_LABELS = {
  length: {
    twa: 'TWA', ear: 'Ear-length', chin: 'Chin-length', shoulder: 'Shoulder-length',
    armpit: 'Armpit-length', mid_back: 'Mid-back', waist_plus: 'Waist+',
  },
  density:   { low: 'Low', medium: 'Medium', high: 'High' },
  porosity:  { low: 'Low', medium: 'Medium', high: 'High' },
  thickness: { fine: 'Fine', medium: 'Medium', coarse: 'Coarse' },
  condition: { healthy: 'Healthy', dry: 'Dry', damaged: 'Damaged', transitioning: 'Transitioning' },
  last_relaxer: { never: 'Never', lt_6mo: '< 6 months ago', '6_12mo': '6–12 months ago', gt_1yr: '> 1 year ago' },
  last_color:   { never: 'Never', lt_3mo: '< 3 months ago', '3_6mo': '3–6 months ago', gt_6mo: '> 6 months ago' },
  last_heat:    { this_week: 'This week', this_month: 'This month', this_year: 'This year', rarely: 'Rarely' },
}

function label(field, val) {
  return FIELD_LABELS[field]?.[val] ?? val ?? '—'
}

function ScoreBar({ score }) {
  const pct = Math.min((score / 10) * 100, 100)
  const color = score >= 7 ? 'bg-red-400' : score >= 4 ? 'bg-amber-400' : 'bg-green-400'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-warm-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-warm-700 w-8 text-right">{score}</span>
    </div>
  )
}

function ProfileRow({ field, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-warm-50 last:border-0">
      <span className="text-xs text-warm-400 font-semibold uppercase tracking-wider">{field}</span>
      <span className="text-sm text-warm-800 font-medium">{value}</span>
    </div>
  )
}

export default function IntakeDetailPage() {
  const router = useRouter()
  const { token } = useParams()

  const [intake, setIntake] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Adjust price modal
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // Request prep modal
  const [showPrepModal, setShowPrepModal] = useState(false)
  const [prepNote, setPrepNote] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('hairly_user')
    if (!stored) { router.push('/login'); return }
    api.get(`/dashboard/intakes/${token}`)
      .then(r => setIntake(r.data))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false))
  }, [token, router])

  async function decide(status, extra = {}) {
    setSaving(true)
    try {
      await api.patch(`/dashboard/intakes/${token}/decision`, { status, ...extra })
      const r = await api.get(`/dashboard/intakes/${token}`)
      setIntake(r.data)
    } finally {
      setSaving(false)
    }
  }

  async function confirmAdjustedPrice() {
    const min = parseFloat(priceMin)
    const max = parseFloat(priceMax)
    if (isNaN(min) || isNaN(max) || min > max) return
    await decide('confirmed', { adjusted_price_min: min, adjusted_price_max: max })
    setShowPriceModal(false)
  }

  async function sendPrepRequest() {
    await decide('prep_requested', { stylist_note: prepNote })
    setShowPrepModal(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center">
      <p className="text-warm-400 text-sm">Loading…</p>
    </div>
  )

  if (!intake) return null

  const { hair_profile: hair, estimate: est, service } = intake
  const effectivePriceMin = intake.adjusted_price_min ?? est?.suggested_price_min
  const effectivePriceMax = intake.adjusted_price_max ?? est?.suggested_price_max
  const priceAdjusted = intake.adjusted_price_min != null

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      {/* Header */}
      <header className="bg-white border-b border-warm-100 px-6 py-4 flex items-center gap-4 shadow-warm">
        <button onClick={() => router.push('/dashboard')} className="text-warm-400 hover:text-warm-700 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl text-warm-900">{intake.client_name}</h1>
          <p className="text-xs text-warm-400">{intake.client_email} · {service?.name}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
          STATUS_STYLES[intake.status] || STATUS_STYLES.pending
        }`}>
          {intake.status.replace('_', ' ')}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Estimate summary */}
        {est && (
          <div className="bg-white border border-warm-100 rounded-3xl p-6 shadow-warm space-y-4">
            <h2 className="font-display text-lg text-warm-900">Complexity estimate</h2>

            <ScoreBar score={est.complexity_score} />

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-warm-50 rounded-2xl p-4 text-center">
                <Clock size={16} className="mx-auto mb-1 text-warm-400" />
                <div className="font-display text-2xl text-warm-700">{est.estimated_service_hours}h</div>
                <div className="text-xs text-warm-400 mt-0.5">service time</div>
              </div>
              <div className="bg-warm-50 rounded-2xl p-4 text-center">
                <DollarSign size={16} className="mx-auto mb-1 text-warm-400" />
                <div className="font-display text-2xl text-warm-700">
                  ${effectivePriceMin}–${effectivePriceMax}
                </div>
                <div className="text-xs text-warm-400 mt-0.5">
                  {priceAdjusted ? 'adjusted price' : 'suggested price'}
                </div>
              </div>
              <div className={`rounded-2xl p-4 text-center ${est.prep_time_minutes > 0 ? 'bg-amber-50' : 'bg-warm-50'}`}>
                <AlertTriangle size={16} className={`mx-auto mb-1 ${est.prep_time_minutes > 0 ? 'text-amber-400' : 'text-warm-300'}`} />
                <div className={`font-display text-2xl ${est.prep_time_minutes > 0 ? 'text-amber-600' : 'text-warm-300'}`}>
                  +{est.prep_time_minutes}m
                </div>
                <div className="text-xs text-warm-400 mt-0.5">prep needed</div>
              </div>
            </div>

            {intake.stylist_note && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 text-sm text-orange-700">
                <span className="font-semibold">Note sent: </span>{intake.stylist_note}
              </div>
            )}
          </div>
        )}

        {/* Decision panel */}
        {hair && (
          <div className="bg-white border border-warm-100 rounded-3xl p-6 shadow-warm">
            <h2 className="font-display text-lg text-warm-900 mb-4">Decision</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={saving || intake.status === 'confirmed'}
                onClick={() => decide('confirmed')}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl px-4 py-3 transition-colors"
              >
                <CheckCircle size={15} /> Accept
              </button>

              <button
                disabled={saving}
                onClick={() => {
                  setPriceMin(String(effectivePriceMin ?? ''))
                  setPriceMax(String(effectivePriceMax ?? ''))
                  setShowPriceModal(true)
                }}
                className="flex items-center justify-center gap-2 bg-warm-700 hover:bg-warm-800 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl px-4 py-3 transition-colors"
              >
                <DollarSign size={15} /> Adjust price
              </button>

              <button
                disabled={saving || intake.status === 'rescheduled'}
                onClick={() => decide('rescheduled')}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl px-4 py-3 transition-colors"
              >
                <Calendar size={15} /> Reschedule
              </button>

              <button
                disabled={saving || intake.status === 'prep_requested'}
                onClick={() => { setPrepNote(''); setShowPrepModal(true) }}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl px-4 py-3 transition-colors"
              >
                <Droplets size={15} /> Request prep
              </button>
            </div>
          </div>
        )}

        {/* Hair profile */}
        {hair && (
          <div className="bg-white border border-warm-100 rounded-3xl p-6 shadow-warm space-y-5">
            <h2 className="font-display text-lg text-warm-900">Hair profile</h2>

            <div>
              <p className="text-xs text-warm-400 font-bold uppercase tracking-widest mb-2">Details</p>
              <ProfileRow field="Length"    value={label('length', hair.length)} />
              <ProfileRow field="Density"   value={label('density', hair.density)} />
              <ProfileRow field="Porosity"  value={label('porosity', hair.porosity)} />
              <ProfileRow field="Thickness" value={label('thickness', hair.thickness)} />
              <ProfileRow field="Condition" value={label('condition', hair.condition)} />
            </div>

            <div>
              <p className="text-xs text-warm-400 font-bold uppercase tracking-widest mb-2">History</p>
              <ProfileRow field="Last relaxer" value={label('last_relaxer', hair.last_relaxer)} />
              <ProfileRow field="Last color"   value={label('last_color', hair.last_color)} />
              <ProfileRow field="Last heat"    value={label('last_heat', hair.last_heat)} />
              <ProfileRow field="Has breakage" value={hair.has_breakage ? 'Yes' : 'No'} />
            </div>

            <div>
              <p className="text-xs text-warm-400 font-bold uppercase tracking-widest mb-2">Day-of prep</p>
              <ProfileRow field="Washed"       value={hair.is_washed ? '✓ Yes' : '✗ No'} />
              <ProfileRow field="Detangled"    value={hair.is_detangled ? '✓ Yes' : '✗ No'} />
              <ProfileRow field="Product-free" value={hair.is_product_free ? '✓ Yes' : '✗ No'} />
            </div>

            {(hair.style_inspiration || hair.preferred_duration_hours || hair.scalp_issues) && (
              <div>
                <p className="text-xs text-warm-400 font-bold uppercase tracking-widest mb-2">Goals</p>
                {hair.preferred_duration_hours && (
                  <ProfileRow field="Preferred duration" value={`${hair.preferred_duration_hours}h`} />
                )}
                {hair.scalp_issues && (
                  <ProfileRow field="Scalp issues" value={hair.scalp_issues} />
                )}
                {hair.style_inspiration && (
                  <div className="py-2.5">
                    <p className="text-xs text-warm-400 font-semibold uppercase tracking-wider mb-1">Style inspo</p>
                    <a
                      href={hair.style_inspiration}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-warm-600 underline break-all"
                    >
                      {hair.style_inspiration}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Adjust price modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-warm-900">Adjust price</h3>
              <button onClick={() => setShowPriceModal(false)} className="text-warm-300 hover:text-warm-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Min ($)</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-warm-400 uppercase tracking-wider">Max ($)</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className="mt-1 w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300"
                />
              </div>
            </div>
            <button
              disabled={saving}
              onClick={confirmAdjustedPrice}
              className="mt-6 w-full bg-warm-700 hover:bg-warm-800 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl py-3 transition-colors"
            >
              Confirm & accept
            </button>
          </div>
        </div>
      )}

      {/* Request prep modal */}
      {showPrepModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-warm-900">Request prep</h3>
              <button onClick={() => setShowPrepModal(false)} className="text-warm-300 hover:text-warm-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-warm-500 mb-4">
              Leave a note for your client about what they need to do before their appointment.
            </p>
            <textarea
              rows={4}
              value={prepNote}
              onChange={e => setPrepNote(e.target.value)}
              placeholder="e.g. Please come with freshly washed, detangled hair with no products…"
              className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none"
            />
            <button
              disabled={saving}
              onClick={sendPrepRequest}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl py-3 transition-colors"
            >
              <Send size={14} /> Send prep request
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
