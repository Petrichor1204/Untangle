'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import api from '@/lib/api'

// ── Shared components ─────────────────────────────────────────────────────────

function RadioGroup({ label, name, value, onChange, options }) {
  return (
    <div>
      <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(({ val, display }) => (
          <label
            key={val}
            className={`cursor-pointer px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              value === val
                ? 'bg-warm-600 text-warm-50 border-warm-600'
                : 'border-warm-200 text-warm-700 hover:border-warm-400 bg-white'
            }`}
          >
            <input type="radio" name={name} value={val} checked={value === val}
              onChange={() => onChange(val)} className="sr-only" />
            {display}
          </label>
        ))}
      </div>
    </div>
  )
}

function Checkbox({ label, checked, onChange, note }) {
  return (
    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
      checked ? 'border-warm-400 bg-warm-50' : 'border-warm-100 hover:border-warm-300 bg-white'
    }`}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
        checked ? 'bg-warm-600 border-warm-600' : 'border-warm-300'
      }`}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div>
        <span className="text-sm font-bold text-warm-800">{label}</span>
        {note && <p className="text-xs text-warm-400 mt-0.5">{note}</p>}
      </div>
    </label>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = ['Hair Details', 'Hair History', 'Preparation', 'Goals', 'Review']

const INITIAL_DATA = {
  length: '', density: '', porosity: '', thickness: '', condition: '',
  last_relaxer: '', last_color: '', last_heat: '', has_breakage: false,
  is_washed: false, is_detangled: false, is_product_free: false,
  style_inspiration: '', preferred_duration_hours: '', scalp_issues: '',
}

function Step0({ data, set }) {
  return (
    <div className="space-y-7">
      <RadioGroup label="Hair length" name="length" value={data.length} onChange={v => set('length', v)}
        options={[
          { val: 'twa', display: 'TWA' }, { val: 'ear', display: 'Ear' }, { val: 'chin', display: 'Chin' },
          { val: 'shoulder', display: 'Shoulder' }, { val: 'armpit', display: 'Armpit' },
          { val: 'mid_back', display: 'Mid-back' }, { val: 'waist_plus', display: 'Waist+' },
        ]}
      />
      <RadioGroup label="Density" name="density" value={data.density} onChange={v => set('density', v)}
        options={[
          { val: 'low', display: 'Low — fine & sparse' },
          { val: 'medium', display: 'Medium' },
          { val: 'high', display: 'High — thick & full' },
        ]}
      />
      <RadioGroup label="Porosity" name="porosity" value={data.porosity} onChange={v => set('porosity', v)}
        options={[
          { val: 'low', display: 'Low — resists moisture' }, { val: 'medium', display: 'Medium — balanced' },
          { val: 'high', display: 'High — absorbs fast' }, { val: 'unsure', display: "Not sure" },
        ]}
      />
      <RadioGroup label="Strand thickness" name="thickness" value={data.thickness} onChange={v => set('thickness', v)}
        options={[
          { val: 'fine', display: 'Fine' }, { val: 'medium', display: 'Medium' }, { val: 'coarse', display: 'Coarse' },
        ]}
      />
      <RadioGroup label="Current condition" name="condition" value={data.condition} onChange={v => set('condition', v)}
        options={[
          { val: 'healthy', display: 'Healthy' }, { val: 'dry', display: 'Dry / brittle' },
          { val: 'damaged', display: 'Damaged' }, { val: 'transitioning', display: 'Transitioning' },
        ]}
      />
    </div>
  )
}

function Step1({ data, set }) {
  return (
    <div className="space-y-7">
      <RadioGroup label="Last relaxer / perm" name="last_relaxer" value={data.last_relaxer} onChange={v => set('last_relaxer', v)}
        options={[
          { val: 'never', display: 'Never' }, { val: 'lt_6mo', display: '< 6 months' },
          { val: '6_12mo', display: '6–12 months' }, { val: 'gt_1yr', display: '> 1 year' },
        ]}
      />
      <RadioGroup label="Last color treatment" name="last_color" value={data.last_color} onChange={v => set('last_color', v)}
        options={[
          { val: 'never', display: 'Never' }, { val: 'lt_3mo', display: '< 3 months' },
          { val: '3_6mo', display: '3–6 months' }, { val: 'gt_6mo', display: '> 6 months' },
        ]}
      />
      <RadioGroup label="Last heat styling" name="last_heat" value={data.last_heat} onChange={v => set('last_heat', v)}
        options={[
          { val: 'this_week', display: 'This week' }, { val: 'this_month', display: 'This month' },
          { val: 'this_year', display: 'This year' }, { val: 'rarely', display: 'Rarely / never' },
        ]}
      />
      <div>
        <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-3">Noticeable breakage?</p>
        <div className="flex gap-3">
          {[{ val: true, display: 'Yes' }, { val: false, display: 'No' }].map(({ val, display }) => (
            <label key={String(val)} className={`cursor-pointer px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
              data.has_breakage === val ? 'bg-warm-600 text-warm-50 border-warm-600' : 'border-warm-200 text-warm-700 hover:border-warm-400'
            }`}>
              <input type="radio" name="has_breakage" checked={data.has_breakage === val}
                onChange={() => set('has_breakage', val)} className="sr-only" />
              {display}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step2({ data, set }) {
  const allGood = data.is_washed && data.is_detangled && data.is_product_free
  return (
    <div className="space-y-3">
      <p className="text-sm text-warm-500 mb-4">
        Check everything that will apply{' '}
        <span className="font-bold text-warm-700">on the day of your appointment.</span>
      </p>
      <Checkbox label="Hair will be freshly washed" note="Within 48 hours of the appointment"
        checked={data.is_washed} onChange={v => set('is_washed', v)} />
      <Checkbox label="Hair will be fully detangled" note="No knots, tangles, or mats"
        checked={data.is_detangled} onChange={v => set('is_detangled', v)} />
      <Checkbox label="Hair will be product-free" note="No heavy oils, butters, or leave-ins"
        checked={data.is_product_free} onChange={v => set('is_product_free', v)} />
      {!allGood && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 mb-1">Heads up</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Arriving without washed or detangled hair adds prep time to your appointment
            and may affect the final price. Your stylist will see this in your profile.
          </p>
        </div>
      )}
    </div>
  )
}

function Step3({ data, set }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
          Style inspiration <span className="text-warm-300 font-normal normal-case tracking-normal">optional</span>
        </label>
        <input type="url" value={data.style_inspiration}
          onChange={e => set('style_inspiration', e.target.value)}
          placeholder="https://www.instagram.com/p/..."
          className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
        />
        <p className="text-xs text-warm-400 mt-1">A link to a photo or Instagram post</p>
      </div>
      <div>
        <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
          How long are you happy to sit?{' '}
          <span className="text-warm-300 font-normal normal-case tracking-normal">optional</span>
        </label>
        <select value={data.preferred_duration_hours}
          onChange={e => set('preferred_duration_hours', e.target.value)}
          className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900"
        >
          <option value="">No preference</option>
          <option value="2">Up to 2 hours</option>
          <option value="3">Up to 3 hours</option>
          <option value="4">Up to 4 hours</option>
          <option value="5">Up to 5 hours</option>
          <option value="6">Up to 6 hours</option>
          <option value="8">8+ hours, no problem</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
          Scalp issues or sensitivities{' '}
          <span className="text-warm-300 font-normal normal-case tracking-normal">optional</span>
        </label>
        <textarea value={data.scalp_issues} onChange={e => set('scalp_issues', e.target.value)}
          rows={3} placeholder="e.g. sensitive scalp, psoriasis, tenderness from a previous style…"
          className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 resize-none placeholder:text-warm-300"
        />
      </div>
    </div>
  )
}

const LABELS = {
  length:       { twa: 'TWA', ear: 'Ear-length', chin: 'Chin-length', shoulder: 'Shoulder-length', armpit: 'Armpit-length', mid_back: 'Mid-back', waist_plus: 'Waist+' },
  density:      { low: 'Low', medium: 'Medium', high: 'High' },
  porosity:     { low: 'Low', medium: 'Medium', high: 'High', unsure: 'Not sure' },
  thickness:    { fine: 'Fine', medium: 'Medium', coarse: 'Coarse' },
  condition:    { healthy: 'Healthy', dry: 'Dry / brittle', damaged: 'Damaged', transitioning: 'Transitioning' },
  last_relaxer: { never: 'Never', lt_6mo: '< 6 months', '6_12mo': '6–12 months', gt_1yr: '> 1 year' },
  last_color:   { never: 'Never', lt_3mo: '< 3 months', '3_6mo': '3–6 months', gt_6mo: '> 6 months' },
  last_heat:    { this_week: 'This week', this_month: 'This month', this_year: 'This year', rarely: 'Rarely / never' },
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-warm-100 last:border-0 gap-4">
      <span className="text-xs text-warm-400 font-semibold shrink-0">{label}</span>
      <span className="text-sm font-bold text-warm-800 text-right">{value || '—'}</span>
    </div>
  )
}

function Step4({ data, sessionInfo }) {
  return (
    <div className="space-y-4">
      <div className="bg-warm-100 border border-warm-200 rounded-2xl px-5 py-4 text-sm">
        <span className="text-warm-500">Service: </span>
        <span className="font-bold text-warm-900">{sessionInfo?.service?.name}</span>
        <span className="text-warm-300 mx-2">·</span>
        <span className="text-warm-500">with </span>
        <span className="font-bold text-warm-900">{sessionInfo?.stylist_name}</span>
      </div>
      {[
        { title: 'Hair details', rows: [['Length', LABELS.length[data.length]], ['Density', LABELS.density[data.density]], ['Porosity', LABELS.porosity[data.porosity]], ['Thickness', LABELS.thickness[data.thickness]], ['Condition', LABELS.condition[data.condition]]] },
        { title: 'Hair history', rows: [['Last relaxer', LABELS.last_relaxer[data.last_relaxer]], ['Last color', LABELS.last_color[data.last_color]], ['Last heat', LABELS.last_heat[data.last_heat]], ['Breakage', data.has_breakage ? 'Yes' : 'No']] },
        { title: 'Preparation', rows: [['Will be washed', data.is_washed ? '✓ Yes' : '✗ No'], ['Will be detangled', data.is_detangled ? '✓ Yes' : '✗ No'], ['Product-free', data.is_product_free ? '✓ Yes' : '✗ No']] },
      ].map(({ title, rows }) => (
        <div key={title} className="bg-white border border-warm-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">{title}</p>
          {rows.map(([label, value]) => <ReviewRow key={label} label={label} value={value} />)}
        </div>
      ))}
      {(data.scalp_issues || data.style_inspiration) && (
        <div className="bg-white border border-warm-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-2">Goals</p>
          {data.style_inspiration && <ReviewRow label="Inspiration" value="Link provided" />}
          {data.scalp_issues && <ReviewRow label="Scalp notes" value={data.scalp_issues} />}
        </div>
      )}
    </div>
  )
}

// ── Wizard ────────────────────────────────────────────────────────────────────

function canProceed(step, data) {
  if (step === 0) return data.length && data.density && data.porosity && data.thickness && data.condition
  if (step === 1) return data.last_relaxer && data.last_color && data.last_heat
  return true
}

export default function IntakeWizardPage() {
  const { slug, token } = useParams()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(INITIAL_DATA)
  const [sessionInfo, setSessionInfo] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/intake/${token}`)
      .then(res => {
        if (res.data.submitted) { router.replace(`/intake/${slug}/${token}/done`); return }
        setSessionInfo(res.data)
        setPageLoading(false)
      })
      .catch(() => { setError('This intake link is invalid or has expired.'); setPageLoading(false) })
  }, [token, slug, router])

  const set = (field, value) => setData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...data,
        preferred_duration_hours: data.preferred_duration_hours ? parseFloat(data.preferred_duration_hours) : null,
      }
      const res = await api.post(`/intake/${token}/submit`, payload)
      localStorage.setItem(`untangle_result_${token}`, JSON.stringify(res.data))
      router.push(`/intake/${slug}/${token}/done`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  if (pageLoading) return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center">
      <span className="text-warm-400 text-sm">Loading…</span>
    </div>
  )

  if (error && !sessionInfo) return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4 text-center">
      <span className="font-brand text-3xl text-warm-600 mb-6">Untangle</span>
      <h1 className="font-display text-2xl text-warm-900 mb-2">Invalid link</h1>
      <p className="text-sm text-warm-400">{error}</p>
    </div>
  )

  const stepComponents = [
    <Step0 key={0} data={data} set={set} />,
    <Step1 key={1} data={data} set={set} />,
    <Step2 key={2} data={data} set={set} />,
    <Step3 key={3} data={data} set={set} />,
    <Step4 key={4} data={data} sessionInfo={sessionInfo} />,
  ]

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      {/* Sticky progress header */}
      <div className="bg-white border-b border-warm-100 shadow-warm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-brand text-xl text-warm-700">Untangle</span>
            {sessionInfo && (
              <span className="text-xs text-warm-400 font-medium">
                {sessionInfo.stylist_name} · {sessionInfo.service?.name}
              </span>
            )}
          </div>
          <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-warm-500 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-warm-500 font-medium">{STEPS[step]}</span>
            <span className="text-xs text-warm-300">{step + 1} of {STEPS.length}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-8">
        <h2 className="font-display text-4xl text-warm-900 mb-7">{STEPS[step]}</h2>

        {stepComponents[step]}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-3 mt-6">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border-2 border-warm-200 text-sm font-semibold text-warm-600 hover:border-warm-400 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed(step, data)}
              className="flex-1 bg-warm-600 text-warm-50 font-semibold py-3.5 rounded-2xl hover:bg-warm-700 transition-colors disabled:opacity-30"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-warm-700 text-warm-50 font-semibold py-3.5 rounded-2xl hover:bg-warm-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit my profile →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
