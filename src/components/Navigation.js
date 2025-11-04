import React, { useState } from 'react';
import { Home, NotebookPen, LogOut, Menu } from 'lucide-react';

const Navigation = ({ currentPage, navigateToPage, handleLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white-600 p-1 shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-8 py-4">
          <div className="flex items-center gap-2">
            {/* <Sparkles className="w-8 h-8 text-purple-600" /> */}
            <span className="text-sm font-impact text-fuchsia-800">hAIrly</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-grow">
            <button 
              onClick={() => navigateToPage('home')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs ${
                currentPage === 'home' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-gray-600 hover:text-fuchsia-600'
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button 
              onClick={() => navigateToPage('learn')}
              className="flex items-center gap-1 text-gray-600 hover:text-fuchsia-600 px-3 py-2 rounded-lg transition-colors text-xs"
            >
              <NotebookPen className="w-5 h-5" />
              Learn
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center text-gray-600 hover:text-red-600 p-2 rounded-lg transition-colors text-xs"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
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
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-fuchsia-100 hover:text-fuchsia-600 transition-colors text-xs"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button 
              onClick={() => {navigateToPage('tracking'); setShowMobileMenu(false);}}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-fuchsia-100 hover:text-fuchsia-600 transition-colors text-xs"
            >
              <NotebookPen className="w-5 h-5" />
              Learn
            </button>
            <button
              onClick={() => {handleLogout(); setShowMobileMenu(false);}}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;