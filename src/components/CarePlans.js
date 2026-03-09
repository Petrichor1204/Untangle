import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { CheckCircle, Play, Bell, AlertCircle, Loader } from 'lucide-react';
import { getCarePlan } from '../api';

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
        const transformedPlan = {
          title: `${result.hairType} Hair Care Plan`,
          duration: "8 weeks",
          steps: [
            {
              id: 1,
              title: "Daily Routine",
              description: result.data.routine.wash_frequency ? 
                `Wash frequency: ${result.data.routine.wash_frequency}` : 
                "Follow your personalized daily routine",
              frequency: "Daily",
              videoUrl: "#",
              products: result.data.products || [],
              completed: false
            },
            {
              id: 2,
              title: "Conditioning",
              description: result.data.routine.conditioning || "Regular conditioning routine",
              frequency: "As recommended",
              videoUrl: "#",
              products: result.data.products.slice(0, 2) || [],
              completed: false
            },
            {
              id: 3,
              title: "Styling",
              description: result.data.routine.styling || "Follow styling recommendations",
              frequency: "As needed",
              videoUrl: "#",
              products: result.data.products.slice(2) || [],
              completed: false
            },
            {
              id: 4,
              title: "Night Care",
              description: result.data.routine.night_care || "Follow night care routine",
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

  const handleStepComplete = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
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
  );
};

export default CarePlans;
