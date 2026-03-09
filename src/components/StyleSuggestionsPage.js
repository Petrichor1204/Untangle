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
      case 'easy': return 'bg-[#e8fbf0] text-[#1f6b46]';
      case 'medium': return 'bg-[#fff6da] text-[#8a6220]';
      case 'advanced': return 'bg-[#ffece1] text-[#a54b1f]';
      default: return 'bg-[#ffe8ee] text-[#e8789a]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#fff5f0] text-[#7a2d45] w-full max-w-5xl max-h-[90vh] rounded-[32px] border border-[#ffd0dc] shadow-2xl flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-[#ffd0dc] bg-white/70 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Style lab</p>
              <h2 className="text-3xl font-display font-medium mt-2 text-[#7a2d45]">Hairstyle suggestions</h2>
              <p className="text-sm text-[#8a4055]">
                Tune your look to the weather, your mood, and the minutes you have to get ready.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#8a4055] hover:text-[#7a2d45] transition rounded-full border border-transparent hover:border-[#ffd0dc] p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-b from-white/80 to-transparent">
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="soft-card p-6 shadow-sm space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#e8789a] mb-1">Plan your look</p>
                <h3 className="text-2xl font-display font-medium text-[#7a2d45]">Tell us about your day</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-2">
                    What's the occasion?
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-2xl border border-[#ffd0dc] bg-white px-3 py-2 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none"
                  >
                    {occasionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-2">
                    Time available
                  </label>
                  {!useCustomTime ? (
                    <div className="flex gap-2">
                      <select
                        value={timeAvailable}
                        onChange={(e) => setTimeAvailable(e.target.value)}
                        className="flex-1 rounded-2xl border border-[#ffd0dc] bg-white px-3 py-2 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none"
                      >
                        {timeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setUseCustomTime(true)}
                        className="px-4 py-2 rounded-2xl border border-[#ffd0dc] text-sm text-[#8a4055] hover:bg-white"
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
                        className="flex-1 rounded-2xl border border-[#ffd0dc] bg-white px-3 py-2 text-sm text-[#7a2d45] focus:ring-2 focus:ring-[#f4a7b9] focus:outline-none"
                        min="1"
                        max="120"
                      />
                      <button
                        onClick={() => {
                          setUseCustomTime(false);
                          setCustomTime('');
                        }}
                        className="px-4 py-2 rounded-2xl border border-[#ffd0dc] text-sm text-[#8a4055] hover:bg-white"
                      >
                        Preset
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-2">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {moodOptions.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`p-3 rounded-2xl border-2 text-center transition ${
                        mood === m.value
                          ? 'bg-[#ffe8ee] border-[#f4a7b9] text-[#e8789a]'
                          : 'bg-white border-[#ffd0dc] text-[#8a4055] hover:border-[#e8789a]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{m.emoji}</div>
                      <div className="text-xs font-semibold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={getSuggestions}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white font-semibold py-3 px-4 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Get Suggestions'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="soft-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#8a4055]">
                    <MapPin className="w-4 h-4 text-[#e8789a]" />
                    <span>Weather check</span>
                  </div>
                  {weather && (
                    <span className="eyebrow">
                      {weather.location || 'Current'}
                    </span>
                  )}
                </div>
                {weather ? (
                  <div className="space-y-3 text-sm text-[#7a2d45]">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-4 h-4 text-[#e8789a]" />
                      <span>{Math.round(weather.temperature)}°F</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Droplets className="w-4 h-4 text-[#e8789a]" />
                      <span>{weather.humidity}% humidity</span>
                    </div>
                    <p className="capitalize text-[#8a4055]">{weather.condition}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#8a4055]">
                    Weather insights will show up after your first suggestion request.
                  </p>
                )}
              </div>

              <div className="soft-card p-5 shadow-sm min-h-[160px]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-2">Why these looks</p>
                {reasoning ? (
                  <p className="text-sm text-[#7a2d45]">{reasoning}</p>
                ) : (
                  <p className="text-sm text-[#8a4055]">
                    We'll explain how mood, time, and weather shape each suggestion after you run a search.
                  </p>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-[#fff6f6] border border-[#ffdede] rounded-[28px] p-4 text-sm text-[#7a5252]">
              {error}
            </div>
          )}

          

          {suggestions.length > 0 && (
            <div className="space-y-4">
              <p className="eyebrow">Personalized looks</p>
              {suggestions.map((style, index) => (
                <div key={index} className="soft-card p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-2xl font-display font-medium text-[#7a2d45]">{style.name}</h4>
                      <p className="text-sm text-[#8a4055] mt-1">{style.description}</p>
                    </div>
                    <button
                      onClick={() => toggleBookmark(style)}
                      className="text-[#8a4055] hover:text-[#7a2d45] transition"
                    >
                      {bookmarkedStyles.has(style.name) ? (
                        <BookmarkCheck className="w-5 h-5 text-[#e8789a]" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#7a2d45]">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(style.difficulty)}`}>
                      {style.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#e8789a]" />
                      <span>{style.time_needed} min</span>
                    </div>
                  </div>

                  {style.image_url && (
                    <div className="rounded-2xl overflow-hidden border border-[#ffd0dc]">
                      <img
                        src={style.image_url}
                        alt={style.name}
                        className="w-full h-52 object-cover"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedStyle(expandedStyle === index ? null : index)}
                    className="flex items-center gap-2 text-sm text-[#8a4055] hover:text-[#7a2d45] transition"
                  >
                    <span>{expandedStyle === index ? 'Hide steps' : 'View steps'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedStyle === index ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedStyle === index && (
                    <div className="pt-3 border-t border-[#ffd0dc]">
                      <h5 className="text-xs uppercase tracking-[0.2em] text-[#e8789a] mb-3">Steps</h5>
                      <ol className="space-y-2 text-sm text-[#7a2d45]">
                        {style.steps.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-[#e8789a]">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && suggestions.length === 0 && !error && (
            <div className="text-center py-14 bg-white/70 border border-[#ffd0dc] rounded-[32px]">
              <Clock className="w-16 h-16 text-[#f4a7b9] mx-auto mb-4" />
              <p className="text-sm text-[#8a4055]">
                Fill out the form above to unlock looks that match your vibe today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleSuggestionsPage;
