import React, { useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import { CheckCircle, Play, Bell, AlertCircle, Loader } from 'lucide-react';
import { getCarePlan } from '../api';
import { updateStreak, addCoins, getCoins } from '../utils/streakUtils';

const CarePlans = ({ 
  currentPage, 
  navigateToPage, 
  handleLogout, 
  completedSteps, 
  setCompletedSteps,
  setActiveReminders,
  activeReminders,
  sessionId,
  carePlan,
  setCarePlan
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsCoins, setCongratsCoins] = useState(0);
  const prevCompletedSizeRef = useRef(completedSteps.size);

  // Fetch care plan when component mounts
  useEffect(() => {
    const fetchCarePlan = async () => {
      const sid = sessionId || localStorage.getItem('hairly_session_id');
      if (!sid) {
        setError('No hair analysis found. Please analyze your hair first.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getCarePlan(sid);
      
      if (result.success) {
        // Transform backend data to match your component structure
        const routine = result.data?.routine || {};
        const products = result.data?.products || [];
        const transformedPlan = {
          title: `${result.hairType || 'Your'} Hair Care Plan`,
          duration: "8 weeks",
          steps: [
            {
              id: 1,
              title: "Daily Routine",
              description: routine.wash_frequency ?
                `Wash frequency: ${routine.wash_frequency}` :
                "Follow your personalized daily routine",
              frequency: "Daily",
              videoUrl: "#",
              products: products,
              completed: false
            },
            {
              id: 2,
              title: "Conditioning",
              description: routine.conditioning || "Regular conditioning routine",
              frequency: "As recommended",
              videoUrl: "#",
              products: products.slice(0, 2),
              completed: false
            },
            {
              id: 3,
              title: "Styling",
              description: routine.styling || "Follow styling recommendations",
              frequency: "As needed",
              videoUrl: "#",
              products: products.slice(2),
              completed: false
            },
            {
              id: 4,
              title: "Night Care",
              description: routine.night_care || "Follow night care routine",
              frequency: "Nightly",
              videoUrl: "#",
              products: ["Silk/satin pillowcase"],
              completed: false
            }
          ]
        };
        
        setCarePlan(transformedPlan);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchCarePlan();
  }, [sessionId, setCarePlan]);

  // Fallback plan if API fails
  const fallbackPlan = {
    title: "General Hair Care Plan",
    duration: "8 weeks",
    steps: [
      {
        id: 1,
        title: "Weekly Deep Conditioning",
        description: "Apply protein-free deep conditioner for 30-45 minutes",
        frequency: "2x per week",
        videoUrl: "#",
        products: ["Deep Treatment Mask", "3 Minute Miracle"],
        completed: false
      },
      {
        id: 2,
        title: "Gentle Cleansing",
        description: "Use sulfate-free shampoo or co-wash",
        frequency: "1x per week",
        videoUrl: "#",
        products: ["Sulfate-free shampoo", "Co-wash"],
        completed: false
      },
      {
        id: 3,
        title: "Moisturize & Seal",
        description: "Apply leave-in conditioner followed by natural oil",
        frequency: "Daily",
        videoUrl: "#",
        products: ["Leave-in conditioner", "Natural oil"],
        completed: false
      },
      {
        id: 4,
        title: "Protective Styling",
        description: "Style hair in low-manipulation protective styles",
        frequency: "Change every 1-2 weeks",
        videoUrl: "#",
        products: ["Silk/satin scrunchies", "Edge control"],
        completed: false
      }
    ]
  };

  const planData = carePlan || fallbackPlan;
  const totalSteps = planData.steps.length;

  // Detect when the user just finished the last task
  useEffect(() => {
    const prev = prevCompletedSizeRef.current;
    const current = completedSteps.size;
    if (current === totalSteps && totalSteps > 0 && prev < totalSteps) {
      const bonus = addCoins(50);
      setCongratsCoins(bonus);
      setShowCongrats(true);
    }
    prevCompletedSizeRef.current = current;
  }, [completedSteps, totalSteps]);

  const handleStepComplete = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
      // Award coins + update streak for each newly completed step
      updateStreak();
      addCoins(15);
    }
    setCompletedSteps(newCompleted);
  };

  const addReminder = (title, time) => {
    const reminder = {
      id: Date.now(),
      title,
      time,
      active: true
    };
    setActiveReminders([...activeReminders, reminder]);
  };

  return (
    <>
    <div className="min-h-screen floral-bg text-[#7a2d45]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <header className="space-y-2">
          <span className="eyebrow">Care guidance</span>
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-medium text-[#7a2d45]">{loading ? 'Building your plan' : planData.title}</h1>
            <p className="text-sm text-[#8a4055]">
              Follow small, doable habits to stretch progress across the entire {planData.duration} program.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="space-y-6">
            <div className="soft-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#e8789a] mb-2">Your plan</p>
                  <h2 className="text-3xl font-display font-medium text-[#7a2d45]">{planData.title}</h2>
                  <p className="text-sm text-[#8a4055]">
                    {loading ? 'Syncing with your latest hair analysis...' : 'Ready when you are.'}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <span className="eyebrow">Duration</span>
                  <p className="text-lg font-semibold text-[#7a2d45]">{planData.duration}</p>
                </div>
              </div>
              <button
                onClick={() => navigateToPage('tracking')}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white font-semibold text-sm px-5 py-3 transition"
              >
                Start tracking
              </button>
            </div>

            <div className="soft-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="eyebrow">Daily cadence</p>
                  <h3 className="text-2xl font-display font-medium text-[#7a2d45]">Action steps</h3>
                </div>
                <span className="text-sm text-[#8a4055]">{planData.steps.length} steps</span>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <Loader className="w-10 h-10 animate-spin text-[#e8789a] mx-auto mb-3" />
                  <p className="text-sm text-[#8a4055]">Loading your personalized care plan...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-10 h-10 text-[#e05a5a] mx-auto mb-3" />
                  <p className="text-sm text-[#764949] mb-4">{error}</p>
                  <button
                    onClick={() => navigateToPage('analysis')}
                    className="text-[#e8789a] font-semibold text-sm underline hover:text-[#d4607f]"
                  >
                    Start hair analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {planData.steps.map((step) => {
                    const isComplete = completedSteps.has(step.id);
                    return (
                      <div
                        key={step.id}
                        className={`rounded-[24px] border border-[#ffd0dc] p-5 transition ${
                          isComplete ? 'bg-[#ffe8ee]' : 'bg-white/70'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleStepComplete(step.id)}
                            className={`mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                              isComplete
                                ? 'bg-[#e8789a] border-[#e8789a] text-white'
                                : 'border-[#ffd0dc] text-[#f4a7b9] hover:border-[#f4a7b9]'
                            }`}
                          >
                            {isComplete && <CheckCircle className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-[#7a2d45]">{step.title}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffe8ee] text-[#e8789a]">
                                {step.frequency}
                              </span>
                            </div>
                            
                            <p className="text-sm text-[#8a4055]">{step.description}</p>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <button
                                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(step.title + ' natural hair care tutorial')}`, '_blank', 'noopener,noreferrer')}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff5f0] text-[#e8789a] text-xs font-semibold hover:bg-[#ffe8ee] transition"
                              >
                                <Play className="w-3 h-3" />
                                Watch tutorial 🎥
                              </button>
                              <button
                                onClick={() => addReminder(step.title, "Daily at 9:00 AM")}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff5f0] text-[#e8789a] text-xs font-semibold hover:bg-[#ffe8ee] transition"
                              >
                                <Bell className="w-3 h-3" />
                                Set reminder 🔔
                              </button>
                            </div>

                            {step.products?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-[#ffd0dc]">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-2">Recommended</p>
                                <div className="flex flex-wrap gap-2">
                                  {step.products.map((product, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 rounded-full bg-[#fff9f7] text-[#b06070] text-xs"
                                    >
                                      {product}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="soft-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="eyebrow">Consistency</p>
                  <h3 className="text-2xl font-display font-medium text-[#7a2d45]">Active reminders 🔔</h3>
                </div>
                <span className="text-4xl font-display font-medium text-[#e8789a]">
                  {activeReminders.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {activeReminders.length ? (
                  activeReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between rounded-2xl bg-[#ffe8ee] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#7a2d45]">{reminder.title}</p>
                        <p className="text-xs text-[#8a4055]">{reminder.time}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#e8789a] uppercase tracking-[0.2em]">
                        On
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#8a4055]">
                    Tap "Set reminder" inside any step to keep your rhythm consistent.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fff9f7] to-[#fff5f0] border border-[#ffd0dc] rounded-[32px] p-6 shadow-sm space-y-4">
              <p className="eyebrow">Weekly focus 🌼</p>
              <ul className="space-y-3 text-sm text-[#8a4055]">
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                  Stack hydration days after cleansing to lock in softness.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                  Alternate protective styles with low-manipulation breaks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                  Capture a progress photo at least once per week for tracking.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    {/* ── All-tasks congratulations modal ── */}
    {showCongrats && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        onClick={() => setShowCongrats(false)}
      >
        <div
          className="relative bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative flowers */}
          <div className="text-5xl mb-3 select-none">🌺🌸🌺</div>

          <h2 className="text-2xl font-display font-semibold text-[#7a2d45] mb-2">
            You crushed it!
          </h2>
          <p className="text-sm text-[#8a4055] mb-5">
            You've completed every step in your care plan. Your hair is going to thank you.
          </p>

          {/* Coins earned */}
          <div className="flex items-center justify-center gap-2 bg-[#ffe8ee] rounded-2xl px-5 py-3 mb-6">
            <span className="text-2xl">🪙</span>
            <div className="text-left">
              <p className="text-xs text-[#b06070] uppercase tracking-wide">Total coins</p>
              <p className="text-2xl font-bold text-[#e8789a]">{congratsCoins.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-xs text-[#b06070] mb-6">
            +50 bonus coins for finishing every task 🎉 Keep going — your streak is counting!
          </p>

          <button
            onClick={() => setShowCongrats(false)}
            className="w-full rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white font-semibold text-sm py-3 transition"
          >
            Keep it up! 💪
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default CarePlans;
