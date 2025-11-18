import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

const Signup = ({ onSignup, navigateToPage }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in every field.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords must match before you can continue.');
      return;
    }
    setError(null);
    onSignup();
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex items-center justify-center px-4 py-12 text-[#1f1338]">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-[#eadffb] text-sm font-semibold tracking-[0.3em] uppercase text-[#b39ef7]">
            <Sparkles className="w-4 h-4" />
            Join hAIrly
          </div>
          <h1 className="text-3xl font-semibold">Create your account</h1>
          <p className="text-sm text-[#6e5c8f]">
            Unlock tailored routines, mood-based style ideas, and a guided diary for your curls.
          </p>
        </div>

        <div className="bg-white/85 border border-[#eadffb] rounded-[32px] p-8 shadow-sm space-y-6">
          {error && (
            <div className="bg-[#fff6f6] border border-[#ffdede] text-sm text-[#7a5252] rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-[#b39ef7] block mb-2">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#b39ef7] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-[#eadffb] bg-white px-11 py-3 text-sm focus:ring-2 focus:ring-[#c9b5ff] focus:outline-none"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-[#b39ef7] block mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#b39ef7] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-[#eadffb] bg-white px-11 py-3 text-sm focus:ring-2 focus:ring-[#c9b5ff] focus:outline-none pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e5c8f] hover:text-[#4b3d6a]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-[#b39ef7] block mb-2">Confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-[#eadffb] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-[#c9b5ff] focus:outline-none"
                placeholder="Repeat password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8256f6] hover:bg-[#6f47d9] text-white py-3 font-semibold transition"
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-sm text-[#6e5c8f]">
            Already have an account?{' '}
            <button
              onClick={() => navigateToPage('login')}
              className="text-[#8256f6] font-semibold hover:text-[#6f47d9]"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
