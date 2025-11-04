import React, { useState } from 'react';
import Navigation from './Navigation';
import { Sparkles, TrendingUp, Camera, Upload, BookOpen, Bookmark } from 'lucide-react';
import StyleSuggestionsPage from './StyleSuggestionsPage';
import BookmarksPage from './BookmarksPage';

const HomePage = ({ 
  currentPage, 
  navigateToPage, 
  handleLogout,
  hairType,
  sessionId
}) => {
  const [showStyleSuggestions, setShowStyleSuggestions] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Welcome back!
          </h1>
          {hairType && (
            <p className="text-gray-600">
              Your hair type: <span className="font-medium capitalize">{hairType}</span>
            </p>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Style Suggestions - Primary Action */}
          <button
            onClick={() => setShowStyleSuggestions(true)}
            className="bg-gray-800 hover:bg-gray-900 text-white p-6 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Sparkles className="w-8 h-8" />
              <span className="text-sm opacity-75">New</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Get Style Suggestions</h3>
            <p className="text-sm text-gray-300">
              Personalized hairstyles based on weather, occasion, and mood
            </p>
          </button>

          {/* View Bookmarks */}
          <button
            onClick={() => setShowBookmarks(true)}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-6 rounded-lg transition-colors text-left group"
          >
            <Bookmark className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Saved Styles</h3>
            <p className="text-sm text-gray-600">
              View your bookmarked hairstyles
            </p>
          </button>

          {/* Progress Tracking */}
          <button
            onClick={() => navigateToPage('tracking')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-6 rounded-lg transition-colors text-left group"
          >
            <TrendingUp className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Track Progress</h3>
            <p className="text-sm text-gray-600">
              Log your hair journey and see improvements
            </p>
          </button>

          {/* New Analysis */}
          <button
            onClick={() => navigateToPage('analysis')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-6 rounded-lg transition-colors text-left group"
          >
            <Camera className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">New Analysis</h3>
            <p className="text-sm text-gray-600">
              Upload a new photo to analyze your hair
            </p>
          </button>

          {/* View Care Plan */}
          <button
            onClick={() => navigateToPage('plan')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-6 rounded-lg transition-colors text-left group"
          >
            <BookOpen className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Care Plan</h3>
            <p className="text-sm text-gray-600">
              View your personalized hair care routine
            </p>
          </button>

          {/* Upload Photo */}
          <button
            onClick={() => navigateToPage('upload')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-6 rounded-lg transition-colors text-left group"
          >
            <Upload className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload Photo</h3>
            <p className="text-sm text-gray-600">
              Start your hair analysis journey
            </p>
          </button>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Hair Tip</h3>
          <p className="text-gray-700 leading-relaxed">
            Remember to protect your hair from environmental damage. Whether it's sun, wind, or humidity, 
            your hair needs extra care. Try our style suggestions feature to find the perfect protective 
            style for today's weather!
          </p>
        </div>
      </div>

      {/* Modals */}
      {showStyleSuggestions && sessionId && (
        <StyleSuggestionsPage 
          onClose={() => setShowStyleSuggestions(false)}
          sessionId={sessionId}
        />
      )}

      {showBookmarks && sessionId && (
        <BookmarksPage
          sessionId={sessionId}
          onClose={() => setShowBookmarks(false)}
        />
      )}
    </div>
  );
};

export default HomePage;