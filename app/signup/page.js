'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const passwordChecks = (pw) => ({
  length: pw.length >= 8,
  lower: /[a-z]/.test(pw),
  upper: /[A-Z]/.test(pw),
  digit: /\d/.test(pw),
})

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', slug: '', location: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const slugPreview = form.slug
    ? `untangle.app/intake/${form.slug.toLowerCase().replace(/\s+/g, '-')}`
    : null

  const pwChecks = passwordChecks(form.password)
  const pwValid = Object.values(pwChecks).every(Boolean)
  const emailValid = EMAIL_RE.test(form.email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailValid) { setError('Please enter a valid email address.'); return }
    if (!pwValid) { setError('Password must meet all requirements below.'); return }
    if (!form.slug.trim()) { setError('A URL slug is required.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        ...form,
        role: 'stylist',
        slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      })
      localStorage.setItem('untangle_token', res.data.access_token)
      localStorage.setItem('untangle_user', JSON.stringify({
        id: res.data.user_id,
        name: res.data.name,
        role: res.data.role,
        slug: res.data.slug,
      }))
      router.push('/onboarding')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="font-brand text-3xl text-warm-700 mb-10">Untangle</Link>

      <div className="bg-white border border-warm-200 rounded-3xl p-10 w-full max-w-sm shadow-warm">
        <h1 className="font-display text-4xl text-warm-900 mb-1">Let's get you set up.</h1>
        <p className="text-warm-500 text-sm mb-8">Create your stylist account.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { field: 'name', label: 'Full name', type: 'text', placeholder: 'Nia Carter' },
            { field: 'email', label: 'Email', type: 'email', placeholder: 'nia@example.com' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
                {label}
              </label>
              <input
                type={type}
                required
                value={form[field]}
                onChange={set(field)}
                placeholder={placeholder}
                className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
              />
              {field === 'email' && form.email && !emailValid && (
                <p className="text-xs text-red-500 mt-1.5">Please enter a valid email address.</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="At least 8 characters"
              className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
            />
            {form.password && (
              <ul className="mt-2 space-y-0.5 text-xs">
                {[
                  ['length', '8+ characters'],
                  ['lower', 'a lowercase letter'],
                  ['upper', 'an uppercase letter'],
                  ['digit', 'a number'],
                ].map(([key, label]) => (
                  <li key={key} className={pwChecks[key] ? 'text-green-600' : 'text-warm-400'}>
                    {pwChecks[key] ? '✓' : '○'} {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="Atlanta, GA"
              className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
              Your intake URL
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={set('slug')}
              placeholder="nia-carter"
              pattern="[a-zA-Z0-9\-]+"
              title="Letters, numbers, and hyphens only"
              className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
            />
            {slugPreview && (
              <p className="text-xs text-warm-500 font-medium mt-1.5 truncate">{slugPreview}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !emailValid || !pwValid || !form.slug.trim() || !form.name.trim()}
            className="w-full bg-warm-700 text-warm-50 font-semibold py-3 rounded-xl hover:bg-warm-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="text-center text-sm text-warm-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-warm-600 font-semibold hover:text-warm-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
