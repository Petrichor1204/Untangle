import React, { useState } from 'react';
import { Home, NotebookPen, LogOut, Menu } from 'lucide-react';

const Navigation = ({ currentPage, navigateToPage, handleLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-[#ffd0dc] shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-brand text-2xl text-[#d4607f]">hAIrly</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-grow">
            <button
              onClick={() => navigateToPage('home')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all text-xs font-medium ${
                currentPage === 'home'
                  ? 'bg-[#ffe8ee] text-[#d4607f]'
                  : 'text-[#b06070] hover:bg-[#fff0f4] hover:text-[#d4607f]'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => navigateToPage('learn')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all text-xs font-medium ${
                currentPage === 'learn'
                  ? 'bg-[#ffe8ee] text-[#d4607f]'
                  : 'text-[#b06070] hover:bg-[#fff0f4] hover:text-[#d4607f]'
              }`}
            >
              <NotebookPen className="w-4 h-4" />
              Learn
            </button>

            <div className="flex-grow" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[#b06070] hover:bg-[#fff0f4] hover:text-[#d4607f] transition-all text-xs font-medium"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sign out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden ml-auto p-2 rounded-full text-[#b06070] hover:bg-[#ffe8ee] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[#ffd0dc] py-3 space-y-1 pb-4">
            <button
              onClick={() => { navigateToPage('home'); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full text-[#b06070] hover:bg-[#ffe8ee] hover:text-[#d4607f] transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => { navigateToPage('learn'); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full text-[#b06070] hover:bg-[#ffe8ee] hover:text-[#d4607f] transition-colors text-sm font-medium"
            >
              <NotebookPen className="w-4 h-4" />
              Learn
            </button>
            <button
              onClick={() => { handleLogout(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full text-[#b06070] hover:bg-[#ffe8ee] hover:text-[#d4607f] transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
