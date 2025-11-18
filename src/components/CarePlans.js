import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { CheckCircle, Play, Bell, AlertCircle, Loader } from 'lucide-react';
import api from '../api';

// Get personalized care plan based on hair analysis
export const getCarePlan = async (sessionId) => {
  try {
    const response = await api.get(`/plan?session_id=${sessionId}`);
    return {
      success: true,
      data: response.data.care_plan,
      hairType: response.data.hair_analysis.hair_type
    };
  } catch (error) {
    console.error('Error fetching care plan:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to get care plan'
    };
  }
};

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
    <div className="min-h-screen bg-[#fdf7ff] text-[#1f1338]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-[#b39ef7]">Care guidance</span>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold">{loading ? 'Building your plan' : planData.title}</h1>
            <p className="text-sm text-[#6e5c8f]">
              Follow small, doable habits to stretch progress across the entire {planData.duration} program.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="space-y-6">
            <div className="bg-white/80 border border-[#eadffb] rounded-[32px] p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7] mb-2">Your plan</p>
                  <h2 className="text-2xl font-semibold">{planData.title}</h2>
                  <p className="text-sm text-[#6e5c8f]">
                    {loading ? 'Syncing with your latest hair analysis...' : 'Ready when you are.'}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#b39ef7]">Duration</span>
                  <p className="text-lg font-semibold">{planData.duration}</p>
                </div>
              </div>
              <button
                onClick={() => navigateToPage('tracking')}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#58c4a5] hover:bg-[#3da888] text-white font-semibold text-sm px-5 py-3 transition"
              >
                Start tracking
              </button>
            </div>

            <div className="bg-white/80 border border-[#eadffb] rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Daily cadence</p>
                  <h3 className="text-xl font-semibold">Action steps</h3>
                </div>
                <span className="text-sm text-[#7a6a98]">{planData.steps.length} steps</span>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <Loader className="w-10 h-10 animate-spin text-[#b39ef7] mx-auto mb-3" />
                  <p className="text-sm text-[#6e5c8f]">Loading your personalized care plan...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-10 h-10 text-[#e05a5a] mx-auto mb-3" />
                  <p className="text-sm text-[#764949] mb-4">{error}</p>
                  <button
                    onClick={() => navigateToPage('analysis')}
                    className="text-[#8256f6] font-semibold text-sm underline hover:text-[#6f47d9]"
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
                        className={`rounded-[24px] border border-[#eadffb] p-5 transition ${
                          isComplete ? 'bg-[#f2eaff]' : 'bg-white/70'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleStepComplete(step.id)}
                            className={`mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                              isComplete
                                ? 'bg-[#8b6ff7] border-[#8b6ff7] text-white'
                                : 'border-[#d7c9ff] text-[#b49af1] hover:border-[#b49af1]'
                            }`}
                          >
                            {isComplete && <CheckCircle className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">{step.title}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ede5ff] text-[#6a4ccf]">
                                {step.frequency}
                              </span>
                            </div>
                            
                            <p className="text-sm text-[#6e5c8f]">{step.description}</p>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffeef3] text-[#c44270] text-xs font-semibold hover:bg-[#ffd8e5] transition">
                                <Play className="w-3 h-3" />
                                Watch tutorial
                              </button>
                              <button
                                onClick={() => addReminder(step.title, "Daily at 9:00 AM")}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0fbf7] text-[#2d8d71] text-xs font-semibold hover:bg-[#daf3ec] transition"
                              >
                                <Bell className="w-3 h-3" />
                                Set reminder
                              </button>
                            </div>

                            {step.products?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-[#f0e8ff]">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#b39ef7] mb-2">Recommended</p>
                                <div className="flex flex-wrap gap-2">
                                  {step.products.map((product, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 rounded-full bg-[#f6f1ff] text-[#5c4d7a] text-xs"
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
            <div className="bg-white/80 border border-[#eadffb] rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Consistency</p>
                  <h3 className="text-xl font-semibold">Active reminders</h3>
                </div>
                <span className="text-3xl font-semibold text-[#8b6ff7]">
                  {activeReminders.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {activeReminders.length ? (
                  activeReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between rounded-2xl bg-[#f6f1ff] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{reminder.title}</p>
                        <p className="text-xs text-[#6e5c8f]">{reminder.time}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#58c4a5] uppercase tracking-[0.2em]">
                        On
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6e5c8f]">
                    Tap "Set reminder" inside any step to keep your rhythm consistent.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fef7ff] to-[#f4fbff] border border-white/60 rounded-[32px] p-6 shadow-sm space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Weekly focus</p>
              <ul className="space-y-3 text-sm text-[#6e5c8f]">
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#b39ef7]" />
                  Stack hydration days after cleansing to lock in softness.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#b39ef7]" />
                  Alternate protective styles with low-manipulation breaks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#b39ef7]" />
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
