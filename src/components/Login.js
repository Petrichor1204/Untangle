import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onLogin, navigateToPage }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both your email and password.');
      return;
    }
    setError(null);
    onLogin();
  };

  return (
    <div className="min-h-screen floral-bg flex items-center justify-center px-4 py-12 text-[#7a2d45]">
      {/* Decorative petals */}
      <span className="fixed top-10 left-10 text-5xl opacity-20 select-none pointer-events-none rotate-[-20deg]">🌸</span>
      <span className="fixed bottom-16 right-12 text-6xl opacity-15 select-none pointer-events-none rotate-[15deg]">🌺</span>
      <span className="fixed top-1/2 right-8 text-4xl opacity-10 select-none pointer-events-none">🌼</span>

      <div className="max-w-lg w-full space-y-6 relative">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#ffd0dc] text-sm font-semibold tracking-[0.25em] uppercase text-[#e8789a]">
            🌸 Welcome back
          </div>
          <h1 className="text-4xl font-display font-medium text-[#7a2d45]">Sign in to hAIrly</h1>
          <p className="text-sm text-[#b06070]">
            Keep tracking routines, log new entries, and get style cues tuned to your day.
          </p>
        </div>

        <div className="soft-card p-8 shadow-sm space-y-6">
          {error && (
            <div className="bg-[#fff6f6] border border-[#ffd0dc] text-sm text-[#9a3050] rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-[#e8789a] block mb-2">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#f4a7b9] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-[#ffd0dc] bg-white px-11 py-3 text-sm focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none placeholder:text-[#d4a0ae]"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-[#e8789a] block mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#f4a7b9] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-[#ffd0dc] bg-white px-11 py-3 text-sm focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none pr-12 placeholder:text-[#d4a0ae]"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b06070] hover:text-[#7a2d45]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white py-3 font-semibold transition petal-pulse"
            >
              🌸 Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-sm text-[#b06070]">
            Don't have an account?{' '}
            <button
              onClick={() => navigateToPage('signup')}
              className="text-[#e8789a] font-semibold hover:text-[#d4607f]"
            >
              Create one here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
