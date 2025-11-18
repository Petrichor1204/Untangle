import Navigation from './Navigation';
import React from 'react';
import { Sparkles, Camera, TrendingUp, Heart, ChevronRight, Upload, Shield, Zap } from 'lucide-react';

export default function LandingPage({ navigateToPage, currentPage, handleLogout }) {
  const features = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: "AI hair analysis",
      description: "Upload a photo and get a simple breakdown of your hair type."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Care routines",
      description: "Explore routines tailored to your hair type, porosity, and goals."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Track your progress",
      description: "Save photos, notes, and observations as your hair changes."
    }
  ];

  const hairTypes = [
    { name: "Coily / Type 4", emoji: "🌀", note: "High shrinkage, tight coils" },
    { name: "Curly / Type 3", emoji: "✨", note: "Defined curls, needs balance" },
    { name: "Wavy / Type 2", emoji: "🌊", note: "Light S-pattern, loves light products" },
    { name: "Straight / Type 1", emoji: "〰️", note: "Low shrinkage, focus on scalp health" }
  ];

  const stats = [
    { label: "Hair types supported", value: "4+", detail: "From straight to coily" },
    { label: "Focus areas", value: "3", detail: "Type, porosity, density" },
    { label: "Experience", value: "You", detail: "Built for real routines" }
  ];

  return (
    <div className="min-h-screen bg-[#1a1423] text-[#f2f2f2]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-16">
        {/* Hero */}
        <section className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[#3b2a5f] text-[#a78bfa]">
              <Zap className="w-3 h-3" />
              <span>AI-powered hair guidance</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Simple tools to understand and care for your hair.
              </h1>
              <p className="text-sm text-gray-300/85 max-w-md">
                No noise, no complicated dashboards. Upload a photo or choose your hair type, learn the basics,
                and build routines that actually match your hair.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigateToPage('signup')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#a78bfa] text-[#1a1423] text-sm font-medium hover:bg-[#c4b4ff] transition-colors"
              >
                Get started
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateToPage('signup')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#3b2a5f] text-sm hover:border-[#a78bfa] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload a photo
              </button>
            </div>
          </div>

          {/* Simple right-side card */}
          <div className="flex-1">
            <div className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-5 space-y-4 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-300/70">
                What you can do here
              </p>
              <ul className="space-y-2 text-gray-200/90">
                <li>• Check your hair type using an image.</li>
                <li>• Learn about porosity and density in short sections.</li>
                <li>• Save routines and see what actually works for you.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
            How it works
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 space-y-3 text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center mb-1">
                  <span className="text-[#a78bfa]">{feature.icon}</span>
                </div>
                <h3 className="font-medium text-gray-100">{feature.title}</h3>
                <p className="text-xs text-gray-300/85">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hair types overview */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
              Hair types we talk about
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4 text-sm">
            {hairTypes.map((type, idx) => (
              <div
                key={idx}
                className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 space-y-2"
              >
                <div className="text-2xl">{type.emoji}</div>
                <p className="font-medium text-gray-100">{type.name}</p>
                <p className="text-xs text-gray-300/80">{type.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust / simple stats */}
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
            What you can expect
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 space-y-2"
              >
                <p className="text-2xl font-semibold text-[#a78bfa]">{stat.value}</p>
                <p className="text-xs font-medium text-gray-100 uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-300/80">{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs pt-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#a78bfa]" />
              <p className="text-gray-300/85">Photos stay in your account and are only used for your analysis.</p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              <p className="text-gray-300/85">Designed around real hair routines, not just product marketing.</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#a78bfa]" />
              <p className="text-gray-300/85">Built with textured and natural hair in mind.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-12">
          <div className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-6 text-center space-y-3">
            <h2 className="text-lg font-semibold">
              Ready to actually understand your hair?
            </h2>
            <p className="text-sm text-gray-300/85 max-w-md mx-auto">
              Create a simple profile, run your first analysis, and start building a routine that fits your real life.
            </p>
            <button
              onClick={() => navigateToPage('signup')}
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#a78bfa] text-[#1a1423] text-sm font-medium hover:bg-[#c4b4ff] transition-colors"
            >
              Start now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
