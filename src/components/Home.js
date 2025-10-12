import React from 'react';
import Navigation from './Navigation';
import StreakCard from './Streak';
import { Camera, ArrowRight, TrendingUp, Scissors, BookMarked, Users, User } from 'lucide-react';

const Home = ({ currentPage, navigateToPage, handleLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Hair Journey! 🌟</h1>
            <p className="text-gray-600 text-lg">Discover your hair's potential with AI-powered analysis and personalized care plans.</p>
          </div>
        </div> */}
        <div className="flex items-center gap-2 p-2">
            <span className="text-sm font-bold text-black-800">Welcome, Euphoria </span>
          </div>
        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Streak */}
          <StreakCard onNavigate={navigateToPage} />
        

          {/* Hair Analysis */}
          <div 
            onClick={() => navigateToPage('analysis')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 text-white">
              <Camera className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Hair Analysis</h3>
              <p className="text-purple-100">Get AI-powered insights about your hair type and condition</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start Analysis</span>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          
          {/* Care Plans */}
          <div 
            onClick={() => navigateToPage('plan')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
          >
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-6 text-white">
              <Scissors className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Care Plans</h3>
              <p className="text-pink-100">Personalized step-by-step hair care routines</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">View Plans</span>
                <ArrowRight className="w-5 h-5 text-pink-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          
          {/* Progress Tracking */}
          <div 
            onClick={() => navigateToPage('tracking')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
          >
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 text-white">
              <TrendingUp className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-green-100">Document your hair journey and see improvements</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">View Journal</span>
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hair Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookMarked className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Hair Care Tips</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-blue-800">Deep Conditioning</h4>
                  <p className="text-sm text-blue-600">Weekly deep conditioning can improve hair moisture by up to 40%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-green-800">Protective Styling</h4>
                  <p className="text-sm text-green-600">Reduce manipulation to prevent breakage and promote growth</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-purple-800">Regular Trims</h4>
                  <p className="text-sm text-purple-600">Trim every 8-12 weeks to maintain healthy ends</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Community */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Community Highlights</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Sarah M.</p>
                  <p className="text-xs text-gray-600">"Saw amazing results after 30 days!"</p>
                </div>
                <div className="text-xs text-gray-500">2 days ago</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Maya K.</p>
                  <p className="text-xs text-gray-600">"The analysis was spot on!"</p>
                </div>
                <div className="text-xs text-gray-500">1 week ago</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Alex R.</p>
                  <p className="text-xs text-gray-600">"Love the personalized plan!"</p>
                </div>
                <div className="text-xs text-gray-500">2 weeks ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;