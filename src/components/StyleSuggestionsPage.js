import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Thermometer, Droplets, Bookmark, BookmarkCheck, ChevronDown } from 'lucide-react';
import api from '../api';


const StyleSuggestionsPage = ({ onClose, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState(null);
  const [bookmarkedStyles, setBookmarkedStyles] = useState(new Set());
  
  // Form inputs
  const [occasion, setOccasion] = useState('casual');
  const [timeAvailable, setTimeAvailable] = useState('15');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [mood, setMood] = useState('relaxed');
  const [expandedStyle, setExpandedStyle] = useState(null);

  const occasionOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'work', label: 'Work' },
    { value: 'school', label: 'School' },
    { value: 'date', label: 'Date' },
    { value: 'birthday', label: 'Birthday/Party' },
    { value: 'gym', label: 'Gym/Exercise' },
    { value: 'formal', label: 'Formal Event' }
  ];

  const timeOptions = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour+' }
  ];

  const moodOptions = [
    { value: 'confident', label: 'Confident', emoji: '😊' },
    { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
    { value: 'relaxed', label: 'Relaxed', emoji: '😌' },
    { value: 'gloomy', label: 'Gloomy', emoji: '😔' },
    { value: 'perky', label: 'Perky', emoji: '🤩' }
  ];

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const response = await api.get(`/bookmarks?session_id=${sessionId}`);
      const bookmarked = new Set(response.data.bookmarks.map(b => b.name));
      setBookmarkedStyles(bookmarked);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const getSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const finalTime = useCustomTime && customTime ? parseInt(customTime) : parseInt(timeAvailable);
      
      const response = await api.post('/style-suggestions', {
        session_id: sessionId,
        occasion: occasion,
        time_available: finalTime,
        current_mood: mood
      });

      setSuggestions(response.data.suggestions);
      setWeather(response.data.weather);
      setReasoning(response.data.reasoning);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (style) => {
    try {
      if (bookmarkedStyles.has(style.name)) {
        await api.delete(`/bookmark-style?session_id=${sessionId}&hairstyle_name=${encodeURIComponent(style.name)}`);
        setBookmarkedStyles(prev => {
          const newSet = new Set(prev);
          newSet.delete(style.name);
          return newSet;
        });
      } else {
        await api.post('/bookmark-style', {
          session_id: sessionId,
          hairstyle_name: style.name,
          hairstyle_data: style
        });
        setBookmarkedStyles(prev => new Set([...prev, style.name]));
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update bookmark');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Hairstyle Suggestions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Input Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-4">Tell us about your day</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Occasion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's the occasion?
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                >
                  {occasionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Time Available */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time available
                </label>
                {!useCustomTime ? (
                  <div className="flex gap-2">
                    <select
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    >
                      {timeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setUseCustomTime(true)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                    >
                      Custom
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="Enter minutes"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                      min="1"
                      max="120"
                    />
                    <button
                      onClick={() => {
                        setUseCustomTime(false);
                        setCustomTime('');
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                    >
                      Preset
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mood */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      mood === m.value
                        ? 'bg-gray-100 border-gray-400 scale-105'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Get Suggestions Button */}
            <button
              onClick={getSuggestions}
              disabled={loading}
              className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Suggestions'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Weather Info */}
          {weather && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Current Weather</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{Math.round(weather.temperature)}°F</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{weather.humidity}%</span>
                  </div>
                  <span className="capitalize text-gray-700">{weather.condition}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reasoning */}
          {reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">{reasoning}</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((style, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">{style.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                      </div>
                      <button
                        onClick={() => toggleBookmark(style)}
                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {bookmarkedStyles.has(style.name) ? (
                          <BookmarkCheck className="w-5 h-5 text-gray-800" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(style.difficulty)}`}>
                        {style.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{style.time_needed} min</span>
                      </div>
                    </div>

                    <img
                      src={style.image_url}
                      alt={style.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />

                    <button
                      onClick={() => setExpandedStyle(expandedStyle === index ? null : index)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <span>View steps</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedStyle === index ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedStyle === index && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="font-medium text-gray-800 mb-2 text-sm">Steps:</h5>
                        <ol className="space-y-2">
                          {style.steps.map((step, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                              <span className="font-medium text-gray-500">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && suggestions.length === 0 && !error && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Fill out the form above to get personalized hairstyle suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleSuggestionsPage;