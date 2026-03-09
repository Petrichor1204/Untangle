import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Clock, ChevronDown, X } from 'lucide-react';
import api from '../api';

const BookmarksPage = ({ sessionId, onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookmark, setExpandedBookmark] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/bookmarks?session_id=${sessionId}`);
      setBookmarks(response.data.bookmarks);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (hairstyleName) => {
    try {
      await api.delete(`/bookmark-style?session_id=${sessionId}&hairstyle_name=${encodeURIComponent(hairstyleName)}`);
      setBookmarks(prev => prev.filter(b => b.name !== hairstyleName));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove bookmark');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#fff5f0] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[#ffd0dc]">
        {/* Header */}
        <div className="bg-white/80 border-b border-[#ffd0dc] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#e8789a]" />
            <h2 className="text-2xl font-display font-medium text-[#7a2d45]">Saved Hairstyles</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#b06070] hover:text-[#7a2d45] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Display */}
          {error && (
            <div className="bg-[#fff6f6] border border-[#ffdede] rounded-lg p-4 mb-6">
              <p className="text-[#7a5252] text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#e8789a] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#8a4055]">Loading your saved styles...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && bookmarks.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-[#f4a7b9] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#7a2d45] mb-2">No saved hairstyles yet</h3>
              <p className="text-[#8a4055]">Bookmark your favorite styles to find them easily later</p>
            </div>
          )}

          {/* Bookmarks List */}
          {!loading && bookmarks.length > 0 && (
            <div className="space-y-4">
              {bookmarks.map((bookmark, index) => {
                const style = bookmark.data;
                return (
                  <div key={index} className="bg-white border border-[#ffd0dc] rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#7a2d45] text-lg">{style.name}</h4>
                          <p className="text-sm text-[#8a4055] mt-1">{style.description}</p>
                          <p className="text-xs text-[#b06070] mt-2">
                            Saved on {formatDate(bookmark.bookmarked_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeBookmark(bookmark.name)}
                          className="ml-4 text-[#b06070] hover:text-[#e05a5a] transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(style.difficulty)}`}>
                          {style.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-[#7a2d45]">
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
                        onClick={() => setExpandedBookmark(expandedBookmark === index ? null : index)}
                        className="flex items-center gap-2 text-sm text-[#8a4055] hover:text-[#7a2d45] transition-colors"
                      >
                        <span>View steps</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedBookmark === index ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedBookmark === index && (
                        <div className="mt-3 pt-3 border-t border-[#ffd0dc]">
                          <h5 className="font-medium text-[#7a2d45] mb-2 text-sm">Steps:</h5>
                          <ol className="space-y-2">
                            {style.steps.map((step, i) => (
                              <li key={i} className="flex gap-2 text-sm text-[#7a2d45]">
                                <span className="font-medium text-[#b06070]">{i + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>

                          {style.best_for && style.best_for.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium text-[#7a2d45] mb-2 text-sm">Best for:</h5>
                              <div className="flex flex-wrap gap-2">
                                {style.best_for.map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-[#ffe8ee] text-[#e8789a] rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
