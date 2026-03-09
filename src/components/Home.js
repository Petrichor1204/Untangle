import React from 'react';
import Navigation from './Navigation';
import StreakCard from './Streak';
import { Camera, ArrowRight, TrendingUp, Scissors, BookMarked, Users, User } from 'lucide-react';

const Home = ({ currentPage, navigateToPage, handleLogout }) => {
  return (
    <div className="min-h-screen floral-bg text-[#7a2d45]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Top header */}
        <header className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.2em] text-[#e8789a]">
            Dashboard
          </span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-medium">Welcome back, Euphoria</h1>
              <p className="text-sm text-[#8a4055]">
                Continue learning about your hair, tracking your journey, and exploring care routines.
              </p>
            </div>
          </div>
        </header>

        {/* Primary grid: Streak + main actions */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Streak on the left, spanning 1 col */}
          <div className="md:col-span-1">
            <StreakCard onNavigate={navigateToPage} />
          </div>

          {/* Main actions */}
          <div className="md:col-span-2 grid gap-4 sm:grid-cols-3">
            {/* Hair Analysis */}
            <button
              onClick={() => navigateToPage('analysis')}
              className="soft-card p-4 flex flex-col justify-between text-left hover:border-[#e8789a] transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-[#ffe8ee] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#e8789a]" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-[#7a2d45]">Hair Analysis</h3>
                <p className="text-xs text-[#8a4055]">
                  Upload a photo or start a quick check to identify your hair type.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#e8789a]">
                <span>Start analysis</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Care Plans */}
            <button
              onClick={() => navigateToPage('plan')}
              className="soft-card p-4 flex flex-col justify-between text-left hover:border-[#e8789a] transition"
            >
              <div className="w-9 h-9 rounded-full bg-[#ffe8ee] flex items-center justify-center mb-4">
                <Scissors className="w-5 h-5 text-[#e8789a]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-[#7a2d45]">Care Plans</h3>
                <p className="text-xs text-[#8a4055]">
                  View structured routines tailored to your hair type and goals.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#e8789a]">
                <span>View plans</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Progress Tracking */}
            <button
              onClick={() => navigateToPage('tracking')}
              className="soft-card p-4 flex flex-col justify-between text-left hover:border-[#e8789a] transition"
            >
              <div className="w-9 h-9 rounded-full bg-[#ffe8ee] flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-[#e8789a]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-[#7a2d45]">Track Progress</h3>
                <p className="text-xs text-[#8a4055]">
                  Log photos, notes, and milestones in your hair journey.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#e8789a]">
                <span>Open journal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </section>

        {/* Secondary grid: Tips + Learning / Community */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Hair Tips */}
          <div className="soft-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-[#e8789a]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#7a2d45]">Quick Hair Tips</h2>
              </div>
              <span className="text-[10px] uppercase text-[#b06070]">
                Daily snippets
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#e8789a]" />
                <div>
                  <p className="font-medium text-[#7a2d45]">Deep conditioning rhythm</p>
                  <p className="text-xs text-[#8a4055]">
                    Aim for weekly deep conditioning if your hair feels dry or brittle.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#e8789a]" />
                <div>
                  <p className="font-medium text-[#7a2d45]">Low manipulation days</p>
                  <p className="text-xs text-[#8a4055]">
                    Rotate in protective or low-manipulation styles to give your strands a break.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#e8789a]" />
                <div>
                  <p className="font-medium text-[#7a2d45]">Scalp check-in</p>
                  <p className="text-xs text-[#8a4055]">
                    Notice flakes, itchiness, or tightness early to adjust products or routines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community / Learning preview */}
          <div className="soft-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#e8789a]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#7a2d45]">Learning & Community</h2>
              </div>
            </div>

            {/* Placeholder "today's learning path" */}
            <div className="border border-[#ffd0dc] rounded-xl p-4 space-y-2 text-sm bg-[#fff9f7]">
              <p className="eyebrow">
                Today's focus
              </p>
              <p className="font-medium text-[#7a2d45]">
                Moisture vs. Protein: understanding what your hair is asking for
              </p>
              <p className="text-xs text-[#8a4055]">
                A short breakdown of how to tell whether your hair needs hydration, strength, or rest.
              </p>
            </div>

            {/* Placeholder community shoutouts */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ffe8ee] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#e8789a]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#7a2d45]">"My twist-outs finally last 3 days."</p>
                  <p className="text-[11px] text-[#b06070]">Shared in Type 4 learning path</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ffe8ee] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#e8789a]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#7a2d45]">"Porosity changed how I choose products."</p>
                  <p className="text-[11px] text-[#b06070]">Shared in Porosity guide</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
