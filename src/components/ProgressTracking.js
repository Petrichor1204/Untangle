import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { TrendingUp, Calendar, Bell, BookOpen, Plus, X, Clock, Camera, Star, AlertCircle, Sparkles, Bookmark } from 'lucide-react';
import api from '../api';
import { getHistory } from '../api';
import { updateStreak, addCoins } from '../utils/streakUtils';
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
    const detail = error.response?.data?.detail;
    const errorMsg = Array.isArray(detail)
      ? detail.map(e => e.msg || JSON.stringify(e)).join(', ')
      : typeof detail === 'string'
      ? detail
      : 'Failed to save progress';
    return { success: false, error: errorMsg };
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
  const [loading, setLoading] = useState(false);   // history fetch only
  const [isSaving, setIsSaving] = useState(false); // save button only
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ notes: '', rating: 5, mood: 'confident' });
  const [error, setError] = useState(null);         // page-level (non-form) errors
  const [formError, setFormError] = useState(null); // inline form errors
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showStyleSuggestions, setShowStyleSuggestions] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  const totalSteps = 4;
  const completionPercent = totalSteps ? Math.round((completedSteps.size / totalSteps) * 100) : 0;
  const resolvedSessionId = sessionId || (typeof window !== 'undefined' ? localStorage.getItem('untangle_session_id') : null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSaveProgress = async (notes, rating, mood) => {
    const storedSessionId = sessionId || localStorage.getItem('untangle_session_id');
    if (!storedSessionId) {
      setFormError('You need to analyze your hair before saving a log entry.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    const result = await saveProgressLog(storedSessionId, { notes, rating, mood });

    if (result.success) {
      setSaveSuccess(true);
      updateStreak();
      addCoins(10);
      fetchHistory(); // refresh in background — don't block the UI
      setTimeout(() => {
        setSaveSuccess(false);
        setShowNewEntry(false);
        setNewEntry({ notes: '', rating: 5, mood: 'confident' });
        setFormError(null);
      }, 1000);
    } else {
      setFormError(result.error);
    }
    setIsSaving(false);
  };

  const fetchHistory = async () => {
    const storedSessionId = sessionId || localStorage.getItem('untangle_session_id');
    if (!storedSessionId) return;
    
    setLoading(true);
    const result = await getHistory(storedSessionId);
    
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
    setFormError(null);
    setSaveSuccess(false);
  };

  const submitNewEntry = async () => {
    if (!newEntry.notes.trim()) {
      setFormError('Please add some notes about your hair journey.');
      return;
    }
    setFormError(null);
    await handleSaveProgress(newEntry.notes, newEntry.rating, newEntry.mood);
  };

  const removeReminder = (id) => {
    setActiveReminders(activeReminders.filter(r => r.id !== id));
  };

  const addQuickReminder = () => {
    if (!reminderTitle.trim()) return;
    const [hours, minutes] = reminderTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    const timeLabel = `Daily at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    setActiveReminders([...activeReminders, {
      id: Date.now(),
      title: reminderTitle.trim(),
      time: timeLabel,
      active: true
    }]);
    setReminderTitle('');
    setReminderTime('09:00');
    setShowReminderForm(false);
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
    const storedSessionId = sessionId || localStorage.getItem('untangle_session_id');
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
    <div className="min-h-screen floral-bg text-[#7a2d45]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="eyebrow">Journey log</span>
            <h1 className="text-4xl font-display font-medium text-[#7a2d45]">Hair journey tracking</h1>
            <p className="text-sm text-[#8a4055]">
              Log how your strands feel, stack reminders, and see your routines turning into momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenStyleIdeas}
              className="inline-flex items-center gap-2 rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white px-5 py-3 text-sm font-semibold transition"
            >
              <Sparkles className="w-4 h-4" />
              Style ideas
            </button>
            <button
              onClick={() => navigateToPage('plan')}
              className="inline-flex items-center gap-2 rounded-full border border-[#ffd0dc] px-5 py-3 text-sm font-semibold text-[#8a4055] hover:bg-white"
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

        <div className="soft-card p-4 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 petal-icon bg-[#ffe8ee] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#e8789a]" />
            </div>
            <div>
              <p className="text-xs text-[#b06070]">Plan progress</p>
              <p className="font-display text-xl text-[#7a2d45]">{completionPercent}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 petal-icon bg-[#ffe8ee] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#e8789a]" />
            </div>
            <div>
              <p className="text-xs text-[#b06070]">Entries logged</p>
              <p className="font-display text-xl text-[#7a2d45]">{logs.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 petal-icon bg-[#ffe8ee] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#e8789a]" />
            </div>
            <div>
              <p className="text-xs text-[#b06070]">Reminders</p>
              <p className="font-display text-xl text-[#7a2d45]">{activeReminders.length}</p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="soft-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#e8789a]" />
                  <h3 className="text-lg font-semibold text-[#7a2d45]">Hair journey log</h3>
                </div>
                {!showNewEntry && (
                  <button
                    onClick={addJournalEntry}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ffe8ee] text-[#e8789a] px-4 py-2 text-sm font-semibold hover:bg-[#ffd0dc]"
                  >
                    <Plus className="w-4 h-4" />
                    New entry
                  </button>
                )}
              </div>

              {showNewEntry && (
                <div className="border border-[#ffd0dc] rounded-[24px] p-4 mb-5 bg-white">
                  <MoodSelector 
                    selectedMood={newEntry.mood}
                    onMoodChange={(mood) => setNewEntry({ ...newEntry, mood })}
                  />

                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#e8789a] block mb-2">
                      Tell us more about your hair today
                    </label>
                    <textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                      placeholder="What did your routine look like? Any wins or new products?"
                      className="w-full rounded-2xl border border-[#ffd0dc] bg-white px-4 py-3 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none resize-none"
                      rows="4"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#e8789a] block mb-2">
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

                  {formError && (
                    <p className="mt-3 text-xs text-[#e05a5a] bg-[#fff6f6] border border-[#ffdede] rounded-xl px-3 py-2">
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={submitNewEntry}
                      disabled={isSaving || saveSuccess}
                      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition ${
                        saveSuccess
                          ? 'bg-[#4caf82] text-white'
                          : 'bg-[#e8789a] hover:bg-[#d4607f] text-white disabled:opacity-60'
                      }`}
                    >
                      {saveSuccess ? 'Saved! ✓' : isSaving ? 'Saving…' : 'Save entry'}
                    </button>
                    <button
                      onClick={cancelNewEntry}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center rounded-full border border-[#ffd0dc] px-5 py-2 text-sm font-semibold text-[#8a4055] hover:bg-white disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {loading && logs.length === 0 ? (
                <div className="text-center py-10">
                  <div className="animate-spin w-8 h-8 border-2 border-[#e8789a] border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm text-[#8a4055]">Loading your progress history...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-sm text-[#8a4055]">
                  <BookOpen className="w-10 h-10 text-[#f4a7b9] mx-auto mb-3" />
                  Start documenting your hair journey to see patterns over time.
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-[#ffd0dc] rounded-[24px] p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                          <span className="font-semibold text-[#7a2d45]">{formatDate(log.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(log.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-[#7a2d45] leading-relaxed">{log.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="soft-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="eyebrow">Reminder stack</p>
                  <h3 className="text-lg font-semibold text-[#7a2d45]">Active reminders</h3>
                </div>
                <span className="text-3xl font-display font-medium text-[#e8789a]">{activeReminders.length}</span>
              </div>

              {activeReminders.length ? (
                <div className="space-y-3">
                  {activeReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between rounded-[20px] bg-[#ffe8ee] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#7a2d45]">{reminder.title}</p>
                        <p className="text-xs text-[#8a4055]">{reminder.time}</p>
                      </div>
                      <button
                        onClick={() => removeReminder(reminder.id)}
                        className="text-[#8a4055] hover:text-[#7a2d45]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8a4055]">
                  No reminders yet. Tag any care plan step to nudge you at the right time of day.
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#fff9f7] to-[#fff5f0] border border-[#ffd0dc] rounded-[32px] p-6 shadow-sm space-y-4">
              <p className="eyebrow">Quick actions</p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowReminderForm(!showReminderForm)}
                  className="w-full rounded-[20px] border border-[#ffd0dc] bg-white/70 px-4 py-3 text-sm font-semibold text-left text-[#8a4055] hover:bg-white flex items-center gap-3"
                >
                  <Clock className="w-4 h-4 text-[#e8789a]" />
                  Schedule a reminder
                </button>

                {showReminderForm && (
                  <div className="rounded-[20px] border border-[#ffd0dc] bg-white p-4 space-y-3">
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#e8789a] block mb-1">
                        Reminder title
                      </label>
                      <input
                        type="text"
                        value={reminderTitle}
                        onChange={(e) => setReminderTitle(e.target.value)}
                        placeholder="e.g. Deep condition hair"
                        className="w-full rounded-xl border border-[#ffd0dc] bg-white px-3 py-2 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#e8789a] block mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full rounded-xl border border-[#ffd0dc] bg-white px-3 py-2 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addQuickReminder}
                        disabled={!reminderTitle.trim()}
                        className="flex-1 rounded-full bg-[#e8789a] text-white text-xs font-semibold py-2 hover:bg-[#d4607f] disabled:opacity-50 transition"
                      >
                        Save reminder
                      </button>
                      <button
                        onClick={() => { setShowReminderForm(false); setReminderTitle(''); setReminderTime('09:00'); }}
                        className="flex-1 rounded-full border border-[#ffd0dc] text-xs font-semibold py-2 text-[#8a4055] hover:bg-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigateToPage('analysis')}
                  className="w-full rounded-[20px] border border-[#ffd0dc] bg-white/70 px-4 py-3 text-sm font-semibold text-left text-[#8a4055] hover:bg-white flex items-center gap-3"
                >
                  <Camera className="w-4 h-4 text-[#e8789a]" />
                  Start a new analysis 📸
                </button>
                <button
                  onClick={() => {
                    const sid = sessionId || localStorage.getItem('untangle_session_id');
                    if (!sid) { setError('Please analyze your hair to access saved styles.'); return; }
                    navigateToPage('bookmarks');
                  }}
                  className="w-full rounded-[20px] border border-[#ffd0dc] bg-white/70 px-4 py-3 text-sm font-semibold text-left text-[#8a4055] hover:bg-white flex items-center gap-3"
                >
                  <Bookmark className="w-4 h-4 text-[#e8789a]" />
                  View saved styles 💇
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
