import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { TrendingUp, Calendar, Bell, BookOpen, Plus, X, Clock, Camera, Star, AlertCircle } from 'lucide-react';
import api from '../api';
import MoodSelector from './MoodSelector';
import StyleRecommendations from './StyleRecommendations';
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
  setActiveReminders 
}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ notes: '', rating: 5, mood: 'confident' });
  const [error, setError] = useState(null);
  const [showStyleRecs, setShowStyleRecs] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSaveProgress = async (notes, rating, mood) => {
    const sessionId = localStorage.getItem('hairly_session_id');
    if (!sessionId) {
      setError('Please analyze your hair first');
      return;
    }
    
    setLoading(true);
    const result = await saveProgressLog(sessionId, { notes, rating, mood });
    
    if (result.success) {
      await fetchHistory();
      setNewEntry({ notes: '', rating: 5, mood: 'confident' });
      setShowNewEntry(false);
      setShowStyleRecs(true);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const sessionId = localStorage.getItem('hairly_session_id');
    if (!sessionId) return;
    
    setLoading(true);
    const result = await getProgressHistory(sessionId);
    
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
    setShowStyleRecs(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hair Journey Tracking</h2>
            <button
              onClick={() => navigateToPage('plan')}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              View Plan
            </button>
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
            <div className="bg-white rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Progress</h3>
              <p className="text-2xl font-bold text-green-500">
                {Math.round((completedSteps.size / totalSteps) * 100)}%
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Entries</h3>
              <p className="text-2xl font-bold text-blue-500">{logs.length}</p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center">
              <Bell className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Reminders</h3>
              <p className="text-2xl font-bold text-purple-500">{activeReminders.length}</p>
            </div>
          </div>

          {/* Style Recommendations */}
          {showStyleRecs && (
            <StyleRecommendations 
              mood={newEntry.mood} 
              onClose={() => setShowStyleRecs(false)} 
            />
          )}
          
          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <div className="bg-white rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Active Reminders
              </h3>
              <div className="space-y-2">
                {activeReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
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
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Hair Journey Log
              </h3>
              {!showNewEntry && (
                <button
                  onClick={addJournalEntry}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Entry
                </button>
              )}
            </div>

            {/* New Entry Form */}
            {showNewEntry && (
              <div className="border border-purple-200 rounded-lg p-4 mb-4 bg-purple-50">
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
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:border-purple-500 focus:outline-none"
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
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Entry'}
                  </button>
                  <button
                    onClick={cancelNewEntry}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Progress History */}
            {loading && logs.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
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
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
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
            <button className="bg-white hover:bg-gray-50 p-4 rounded-xl text-center transition-colors">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Schedule Reminder</span>
            </button>
            
            <button
              onClick={() => navigateToPage('analysis')}
              className="bg-white hover:bg-gray-50 p-4 rounded-xl text-center transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">New Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;