'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react'

export default function IntakeDonePage() {
  const { token } = useParams()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(`untangle_result_${token}`)
    if (stored) setResult(JSON.parse(stored))
  }, [token])

  return (
    <div className="min-h-screen bg-warm-50 font-body">

      {/* Header */}
      <div className="bg-warm-700 px-8 py-6">
        <div className="max-w-md mx-auto text-center">
          <span className="font-brand text-2xl text-warm-100 block mb-5">Untangle</span>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-warm-600 mb-4">
            <CheckCircle size={28} className="text-warm-100" />
          </div>
          <h1 className="font-display text-4xl text-warm-50 mb-2">All done.</h1>
          {result ? (
            <p className="text-warm-300 text-sm">
              <span className="text-warm-100 font-semibold">{result.stylist_name}</span> will
              review your profile and confirm your appointment.
            </p>
          ) : (
            <p className="text-warm-300 text-sm">
              Your stylist will review your profile and be in touch to confirm.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-10 space-y-5">

        {/* Estimate */}
        {result?.estimate && (
          <div className="bg-white border border-warm-100 rounded-3xl overflow-hidden shadow-warm">
            <div className="bg-warm-100 px-6 py-4 border-b border-warm-200">
              <p className="text-xs font-bold text-warm-600 uppercase tracking-widest">
                Untangle estimate
              </p>
              <p className="text-xs text-warm-400 mt-0.5">
                Based on your profile. Your stylist sets the final price.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-sm text-warm-600">
                  <Clock size={14} className="text-warm-400" /> Service time
                </span>
                <span className="font-bold text-warm-900 text-sm">
                  {result.estimate.estimated_service_hours} hours
                </span>
              </div>

              {result.estimate.prep_time_minutes > 0 && (
                <div className="flex items-center justify-between py-1 px-4 bg-amber-50 border border-amber-100 rounded-xl -mx-1">
                  <span className="flex items-center gap-2 text-sm text-amber-700">
                    <AlertTriangle size={14} /> Prep time needed
                  </span>
                  <span className="font-bold text-amber-800 text-sm">
                    +{result.estimate.prep_time_minutes} min
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-sm text-warm-600">
                  <DollarSign size={14} className="text-warm-400" /> Suggested price
                </span>
                <span className="font-bold text-warm-700 text-sm">
                  ${result.estimate.suggested_price_min}–${result.estimate.suggested_price_max}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="bg-white border border-warm-100 rounded-3xl p-6 shadow-warm">
          <h2 className="font-display text-2xl text-warm-900 mb-5">What happens next</h2>
          <div className="space-y-4">
            {[
              'Your stylist receives your full hair profile and the Untangle estimate.',
              'They\'ll confirm the appointment — or reach out if they need to adjust the time or price.',
              'You show up. They\'re ready. Everything\'s been handled.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-warm-100 border border-warm-200 text-warm-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-warm-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-warm-300 pt-2">
          Powered by <span className="font-brand text-warm-500">Untangle</span>
        </p>
      </div>
    </div>
  )
}
