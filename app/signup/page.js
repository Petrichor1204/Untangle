'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', slug: '', location: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const slugPreview = form.slug
    ? `hairly.app/intake/${form.slug.toLowerCase().replace(/\s+/g, '-')}`
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!form.slug.trim()) { setError('A URL slug is required.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        ...form,
        role: 'stylist',
        slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      })
      localStorage.setItem('hairly_token', res.data.access_token)
      localStorage.setItem('hairly_user', JSON.stringify({
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
      <Link href="/" className="font-brand text-3xl text-warm-700 mb-10">Hairly</Link>

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
            { field: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
            { field: 'location', label: 'Location (optional)', type: 'text', placeholder: 'Atlanta, GA' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">
                {label}
              </label>
              <input
                type={type}
                required={field !== 'location'}
                value={form[field]}
                onChange={set(field)}
                placeholder={placeholder}
                className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
              />
            </div>
          ))}

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
            disabled={loading}
            className="w-full bg-warm-700 text-warm-50 font-semibold py-3 rounded-xl hover:bg-warm-800 transition-colors disabled:opacity-50 mt-2"
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
