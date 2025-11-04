import Navigation from './Navigation';
import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, TrendingUp, Heart, ChevronRight, Upload, Shield, Zap } from 'lucide-react';

export default function LandingPage({ navigateToPage, currentPage, handleLogout }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Upload a photo and our AI identifies your hair type instantly"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Custom Plans",
      description: "Get personalized routines tailored to your unique hair needs"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your hair journey with photos and notes over time"
    }
  ];

  const hairTypes = [
    { name: "Curly", gradient: "from-purple-400 to-pink-400", emoji: "🌀" },
    { name: "Straight", gradient: "from-blue-400 to-cyan-400", emoji: "💫" },
    { name: "Wavy", gradient: "from-emerald-400 to-teal-400", emoji: "🌊" },
    { name: "Coily", gradient: "from-amber-400 to-orange-400", emoji: "✨" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-900 text-white overflow-hidden">
        <Navigation 
            currentPage={currentPage} 
            navigateToPage={navigateToPage} 
            handleLogout={handleLogout} 
        />
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen animate-float"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)', 'rgba(59, 130, 246, 0.1)'][i % 3]
              }, transparent)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">AI-Powered Hair Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Find the Best Care
            </span>
            <br />
            <span className="text-white">for Your Hair Type</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Upload a photo, discover your hair type, and unlock a personalized care routine designed just for you
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => navigateToPage('signup')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={() => navigateToPage('signup')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Photo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: "Hair Types", value: "4+" },
              { label: "Accuracy", value: "95%" },
              { label: "Users", value: "10K+" }
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Three simple steps to beautiful hair</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hair Types Showcase */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              All Hair Types <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Welcome</span>
            </h2>
            <p className="text-gray-400 text-lg">Personalized care for every texture</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {hairTypes.map((type, i) => (
              <div
                key={i}
                className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {type.emoji}
                  </div>
                  <h3 className="text-xl font-bold">{type.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Shield className="w-8 h-8" />, text: "Privacy Protected" },
              { icon: <Zap className="w-8 h-8" />, text: "Instant Results" },
              { icon: <Heart className="w-8 h-8" />, text: "Expert Approved" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="text-purple-400">{item.icon}</div>
                <p className="text-gray-300 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Hair?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands discovering their perfect hair care routine
            </p>
            <button className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-xl hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-purple-500/50"
                onClick={() => navigateToPage('signup')}>
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
}