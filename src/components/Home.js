import React from 'react';
import Navigation from './Navigation';
import StreakCard from './Streak';
import { Camera, ArrowRight, TrendingUp, Scissors, BookMarked, Users, User } from 'lucide-react';

const Home = ({ currentPage, navigateToPage, handleLogout }) => {
  return (
    <div className="min-h-screen bg-[#1a1423] text-[#f2f2f2]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Top header */}
        <header className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.2em] text-[#a78bfa]/80">
            Dashboard
          </span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, Euphoria</h1>
              <p className="text-sm text-gray-300/80">
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
              className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 flex flex-col justify-between text-left hover:border-[#a78bfa] transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#a78bfa]" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Hair Analysis</h3>
                <p className="text-xs text-gray-300/80">
                  Upload a photo or start a quick check to identify your hair type.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#a78bfa]">
                <span>Start analysis</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Care Plans */}
            <button
              onClick={() => navigateToPage('plan')}
              className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 flex flex-col justify-between text-left hover:border-[#a78bfa] transition"
            >
              <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center mb-4">
                <Scissors className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Care Plans</h3>
                <p className="text-xs text-gray-300/80">
                  View structured routines tailored to your hair type and goals.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#a78bfa]">
                <span>View plans</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Progress Tracking */}
            <button
              onClick={() => navigateToPage('tracking')}
              className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-4 flex flex-col justify-between text-left hover:border-[#a78bfa] transition"
            >
              <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Track Progress</h3>
                <p className="text-xs text-gray-300/80">
                  Log photos, notes, and milestones in your hair journey.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#a78bfa]">
                <span>Open journal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </section>

        {/* Secondary grid: Tips + Learning / Community */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Hair Tips */}
          <div className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-[#a78bfa]" />
                <h2 className="text-sm font-semibold tracking-wide">Quick Hair Tips</h2>
              </div>
              <span className="text-[10px] uppercase text-gray-300/70">
                Daily snippets
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#a78bfa]" />
                <div>
                  <p className="font-medium text-gray-100">Deep conditioning rhythm</p>
                  <p className="text-xs text-gray-300/80">
                    Aim for weekly deep conditioning if your hair feels dry or brittle.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#a78bfa]" />
                <div>
                  <p className="font-medium text-gray-100">Low manipulation days</p>
                  <p className="text-xs text-gray-300/80">
                    Rotate in protective or low-manipulation styles to give your strands a break.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1 h-1 rounded-full bg-[#a78bfa]" />
                <div>
                  <p className="font-medium text-gray-100">Scalp check-in</p>
                  <p className="text-xs text-gray-300/80">
                    Notice flakes, itchiness, or tightness early to adjust products or routines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community / Learning preview */}
          <div className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#a78bfa]" />
                <h2 className="text-sm font-semibold tracking-wide">Learning & Community</h2>
              </div>
            </div>

            {/* Placeholder “today’s learning path” */}
            <div className="border border-[#3b2a5f] rounded-xl p-4 space-y-2 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-300/70">
                Today's focus
              </p>
              <p className="font-medium text-gray-100">
                Moisture vs. Protein: understanding what your hair is asking for
              </p>
              <p className="text-xs text-gray-300/80">
                A short breakdown of how to tell whether your hair needs hydration, strength, or rest.
              </p>
            </div>

            {/* Placeholder community shoutouts */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#a78bfa]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-100">“My twist-outs finally last 3 days.”</p>
                  <p className="text-[11px] text-gray-300/70">Shared in Type 4 learning path</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#a78bfa]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-100">“Porosity changed how I choose products.”</p>
                  <p className="text-[11px] text-gray-300/70">Shared in Porosity guide</p>
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
