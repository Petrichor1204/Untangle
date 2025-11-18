import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { TrendingUp, Calendar, Bell, BookOpen, Plus, X, Clock, Camera, Star, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api';
import MoodSelector from './MoodSelector';
import StyleSuggestionsPage from './StyleSuggestionsPage';
import { getMoodEmoji } from '../utils/moodConfig';

// Save progress log entry
export const saveProgressLog = async (sessionId, logData) => {
  try {
    const response = await api.post(`/log?session_id=${sessionId}`, {
      notes: logData.notes,
      rating: logData.rating,
      mood: logData.mood,
      photo_url: logData.photo_url || null
    });
    
    return {
      success: true,
      logId: response.data.log_id,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error saving progress:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to save progress'
    };
  }
};

// Get user's progress history
export const getProgressHistory = async (sessionId) => {
  try {
    const response = await api.get(`/history?session_id=${sessionId}`);
    
    return {
      success: true,
      logs: response.data.logs,
      totalLogs: response.data.total_logs,
      hairType: response.data.hair_type
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to get history'
    };
  }
};

const ProgressTracking = ({ 
  currentPage, 
  navigateToPage, 
  handleLogout, 
  completedSteps,
  journalEntries,
  setJournalEntries,
  activeReminders,
  setActiveReminders,
  sessionId
}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ notes: '', rating: 5, mood: 'confident' });
  const [error, setError] = useState(null);
  const [showStyleSuggestions, setShowStyleSuggestions] = useState(false);

  const totalSteps = 4;
  const completionPercent = totalSteps ? Math.round((completedSteps.size / totalSteps) * 100) : 0;
  const resolvedSessionId = sessionId || (typeof window !== 'undefined' ? localStorage.getItem('hairly_session_id') : null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSaveProgress = async (notes, rating, mood) => {
    const storedSessionId = sessionId || localStorage.getItem('hairly_session_id');
    if (!storedSessionId) {
      setError('Please analyze your hair first');
      return;
    }
    
    setLoading(true);
    const result = await saveProgressLog(storedSessionId, { notes, rating, mood });
    
    if (result.success) {
      await fetchHistory();
      setNewEntry({ notes: '', rating: 5, mood: 'confident' });
      setShowNewEntry(false);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const storedSessionId = sessionId || localStorage.getItem('hairly_session_id');
    if (!storedSessionId) return;
    
    setLoading(true);
    const result = await getProgressHistory(storedSessionId);
    
    if (result.success) {
      setLogs(result.logs);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const addJournalEntry = () => {
    setShowNewEntry(true);
    setError(null);
  };

  const cancelNewEntry = () => {
    setShowNewEntry(false);
    setNewEntry({ notes: '', rating: 5, mood: 'confident' });
    setError(null);
  };

  const submitNewEntry = async () => {
    if (!newEntry.notes.trim()) {
      setError('Please add some notes about your hair journey');
      return;
    }
    await handleSaveProgress(newEntry.notes, newEntry.rating, newEntry.mood);
  };

  const removeReminder = (id) => {
    setActiveReminders(activeReminders.filter(r => r.id !== id));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleOpenStyleIdeas = () => {
    const storedSessionId = sessionId || localStorage.getItem('hairly_session_id');
    if (!storedSessionId) {
      setError('Please analyze your hair to unlock personalized style ideas.');
      return;
    }
    setError(null);
    setShowStyleSuggestions(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1f1338]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#b39ef7]">Journey log</span>
            <h1 className="text-3xl font-semibold">Hair journey tracking</h1>
            <p className="text-sm text-[#6e5c8f]">
              Log how your strands feel, stack reminders, and see your routines turning into momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenStyleIdeas}
              className="inline-flex items-center gap-2 rounded-full bg-[#8256f6] hover:bg-[#6f47d9] text-white px-5 py-3 text-sm font-semibold transition"
            >
              <Sparkles className="w-4 h-4" />
              Style ideas
            </button>
            <button
              onClick={() => navigateToPage('plan')}
              className="inline-flex items-center gap-2 rounded-full border border-[#eadffb] px-5 py-3 text-sm font-semibold text-[#6e5c8f] hover:bg-white"
            >
              View care plan
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-[#fff6f6] border border-[#ffdede] rounded-[24px] px-5 py-4 flex items-center gap-3 text-sm text-[#7a5252]">
            <AlertCircle className="w-4 h-4 text-[#e05a5a]" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-[#c44141] hover:text-[#a83636]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-[#eadffb] bg-white/80 p-5 text-center shadow-sm">
            <TrendingUp className="w-8 h-8 text-[#58c4a5] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Progress</p>
            <p className="text-3xl font-semibold">{completionPercent}%</p>
          </div>
          <div className="rounded-[28px] border border-[#eadffb] bg-white/80 p-5 text-center shadow-sm">
            <Calendar className="w-8 h-8 text-[#6a4ccf] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Entries logged</p>
            <p className="text-3xl font-semibold">{logs.length}</p>
          </div>
          <div className="rounded-[28px] border border-[#eadffb] bg-white/80 p-5 text-center shadow-sm">
            <Bell className="w-8 h-8 text-[#f3a547] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Active reminders</p>
            <p className="text-3xl font-semibold">{activeReminders.length}</p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="bg-white/85 border border-[#eadffb] rounded-[32px] p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#6a4ccf]" />
                  <h3 className="text-lg font-semibold">Hair journey log</h3>
                </div>
                {!showNewEntry && (
                  <button
                    onClick={addJournalEntry}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ede5ff] text-[#6a4ccf] px-4 py-2 text-sm font-semibold hover:bg-[#e2d8ff]"
                  >
                    <Plus className="w-4 h-4" />
                    New entry
                  </button>
                )}
              </div>

              {showNewEntry && (
                <div className="border border-[#eadffb] rounded-[24px] p-4 mb-5 bg-white">
                  <MoodSelector 
                    selectedMood={newEntry.mood}
                    onMoodChange={(mood) => setNewEntry({ ...newEntry, mood })}
                  />

                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#b39ef7] block mb-2">
                      Tell us more about your hair today
                    </label>
                    <textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                      placeholder="What did your routine look like? Any wins or new products?"
                      className="w-full rounded-2xl border border-[#eadffb] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-[#c9b5ff] focus:outline-none resize-none"
                      rows="4"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#b39ef7] block mb-2">
                      Rate your hair today
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setNewEntry({ ...newEntry, rating })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              rating <= newEntry.rating ? 'text-[#f4b73c] fill-current' : 'text-[#dcd0f7]'
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      onClick={submitNewEntry}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-full bg-[#8256f6] text-white px-5 py-2 text-sm font-semibold hover:bg-[#6f47d9] disabled:opacity-60"
                    >
                      {loading ? 'Saving...' : 'Save entry'}
                    </button>
                    <button
                      onClick={cancelNewEntry}
                      className="inline-flex items-center justify-center rounded-full border border-[#eadffb] px-5 py-2 text-sm font-semibold text-[#6e5c8f] hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {loading && logs.length === 0 ? (
                <div className="text-center py-10">
                  <div className="animate-spin w-8 h-8 border-2 border-[#b39ef7] border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm text-[#6e5c8f]">Loading your progress history...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-sm text-[#6e5c8f]">
                  <BookOpen className="w-10 h-10 text-[#d8c9ff] mx-auto mb-3" />
                  Start documenting your hair journey to see patterns over time.
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-[#eadffb] rounded-[24px] p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                          <span className="font-semibold">{formatDate(log.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(log.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-[#4c4d6a] leading-relaxed">{log.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/85 border border-[#eadffb] rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Reminder stack</p>
                  <h3 className="text-lg font-semibold">Active reminders</h3>
                </div>
                <span className="text-2xl font-semibold text-[#8b6ff7]">{activeReminders.length}</span>
              </div>

              {activeReminders.length ? (
                <div className="space-y-3">
                  {activeReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between rounded-[20px] bg-[#f6f1ff] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold">{reminder.title}</p>
                        <p className="text-xs text-[#6e5c8f]">{reminder.time}</p>
                      </div>
                      <button
                        onClick={() => removeReminder(reminder.id)}
                        className="text-[#6e5c8f] hover:text-[#4b3d6a]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6e5c8f]">
                  No reminders yet. Tag any care plan step to nudge you at the right time of day.
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#fef7ff] to-[#f4fbff] border border-white/60 rounded-[32px] p-6 shadow-sm space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b39ef7]">Quick actions</p>
              <div className="space-y-3">
                <button className="w-full rounded-[20px] border border-[#eadffb] bg-white/70 px-4 py-3 text-sm font-semibold text-left text-[#6e5c8f] hover:bg-white flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#6a4ccf]" />
                  Schedule a reminder
                </button>
                <button
                  onClick={() => navigateToPage('analysis')}
                  className="w-full rounded-[20px] border border-[#eadffb] bg-white/70 px-4 py-3 text-sm font-semibold text-left text-[#6e5c8f] hover:bg-white flex items-center gap-3"
                >
                  <Camera className="w-4 h-4 text-[#6a4ccf]" />
                  Start a new analysis
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showStyleSuggestions && resolvedSessionId && (
        <StyleSuggestionsPage 
          onClose={() => setShowStyleSuggestions(false)}
          sessionId={resolvedSessionId}
        />
      )}
    </div>
  );
};

export default ProgressTracking;
