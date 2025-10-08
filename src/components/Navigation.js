import React, { useState } from 'react';
import { Sparkles, Home, Camera, BookOpen, LogOut, Menu } from 'lucide-react';

const Navigation = ({ currentPage, navigateToPage, handleLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">HAIrly</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateToPage('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button 
              onClick={() => navigateToPage('analysis')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-lg transition-colors"
            >
              <Camera className="w-5 h-5" />
              Analyze
            </button>
            <button 
              onClick={() => navigateToPage('tracking')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Journal
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t py-4 space-y-2">
            <button 
              onClick={() => {navigateToPage('home'); setShowMobileMenu(false);}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button 
              onClick={() => {navigateToPage('analysis'); setShowMobileMenu(false);}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Analyze
            </button>
            <button 
              onClick={() => {navigateToPage('tracking'); setShowMobileMenu(false);}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Journal
            </button>
            <button
              onClick={() => {handleLogout(); setShowMobileMenu(false);}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;