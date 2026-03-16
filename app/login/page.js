'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('hairly_token', res.data.access_token)
      localStorage.setItem('hairly_user', JSON.stringify({
        id: res.data.user_id,
        name: res.data.name,
        role: res.data.role,
        slug: res.data.slug,
      }))
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-brand text-3xl text-warm-700 mb-10">Hairly</Link>

      <div className="bg-white border border-warm-200 rounded-3xl p-10 w-full max-w-sm shadow-warm">
        <h1 className="font-display text-4xl text-warm-900 mb-1">Welcome back.</h1>
        <p className="text-warm-500 text-sm mb-8">Log in to your stylist account.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-warm-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-warm-200 focus:border-warm-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-warm-50 text-warm-900 placeholder:text-warm-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-warm-700 text-warm-50 font-semibold py-3 rounded-xl hover:bg-warm-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in →'}
          </button>
        </form>

        <p className="text-center text-sm text-warm-400 mt-8">
          No account?{' '}
          <Link href="/signup" className="text-warm-600 font-semibold hover:text-warm-800">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
