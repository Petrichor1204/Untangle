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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hair Journey Tracking</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowStyleSuggestions(true)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Style Ideas
              </button>
              <button
                onClick={() => navigateToPage('plan')}
                className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                View Plan
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Progress</h3>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((completedSteps.size / totalSteps) * 100)}%
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Entries</h3>
              <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Reminders</h3>
              <p className="text-2xl font-bold text-gray-600">{activeReminders.length}</p>
            </div>
          </div>
          
          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Active Reminders
              </h3>
              <div className="space-y-2">
                {activeReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">{reminder.title}</p>
                      <p className="text-sm text-blue-600">{reminder.time}</p>
                    </div>
                    <button
                      onClick={() => removeReminder(reminder.id)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hair Journal */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Hair Journey Log
              </h3>
              {!showNewEntry && (
                <button
                  onClick={addJournalEntry}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Entry
                </button>
              )}
            </div>

            {/* New Entry Form */}
            {showNewEntry && (
              <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                <MoodSelector 
                  selectedMood={newEntry.mood}
                  onMoodChange={(mood) => setNewEntry({ ...newEntry, mood })}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us more about your hair today
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="Describe your hair's condition, any changes you've noticed, products used..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    rows="4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate your hair today (1-5 stars)
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewEntry({ ...newEntry, rating })}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            rating <= newEntry.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={submitNewEntry}
                    disabled={loading}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Entry'}
                  </button>
                  <button
                    onClick={cancelNewEntry}
                    className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Progress History */}
            {loading && logs.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your progress history...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Start documenting your hair journey!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                        <span className="font-medium text-gray-800">{formatDate(log.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(log.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{log.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white hover:bg-gray-50 border border-gray-300 p-4 rounded-xl text-center transition-colors">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Schedule Reminder</span>
            </button>
            
            <button
              onClick={() => navigateToPage('analysis')}
              className="bg-white hover:bg-gray-50 border border-gray-300 p-4 rounded-xl text-center transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">New Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Style Suggestions Modal */}
      {showStyleSuggestions && sessionId && (
        <StyleSuggestionsPage 
          onClose={() => setShowStyleSuggestions(false)}
          sessionId={sessionId}
        />
      )}
    </div>
  );
};

export default ProgressTracking;