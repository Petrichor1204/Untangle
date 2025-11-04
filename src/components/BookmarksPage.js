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
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
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
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">Saved Hairstyles</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your saved styles...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && bookmarks.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No saved hairstyles yet</h3>
              <p className="text-gray-500">Bookmark your favorite styles to find them easily later</p>
            </div>
          )}

          {/* Bookmarks List */}
          {!loading && bookmarks.length > 0 && (
            <div className="space-y-4">
              {bookmarks.map((bookmark, index) => {
                const style = bookmark.data;
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg">{style.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Saved on {formatDate(bookmark.bookmarked_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeBookmark(bookmark.name)}
                          className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-5 h-5" />
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
                        onClick={() => setExpandedBookmark(expandedBookmark === index ? null : index)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <span>View steps</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedBookmark === index ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedBookmark === index && (
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

                          {style.best_for && style.best_for.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium text-gray-800 mb-2 text-sm">Best for:</h5>
                              <div className="flex flex-wrap gap-2">
                                {style.best_for.map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
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