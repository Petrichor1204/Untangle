import React, { useState, useRef, useCallback } from 'react';
import Navigation from './Navigation';
import { Camera, Upload, ArrowRight, AlertCircle } from 'lucide-react';
import { uploadHairPhoto } from '../api';

const HairAnalysis = ({ 
  currentPage, 
  navigateToPage, 
  handleLogout, 
  capturedImage, 
  setCapturedImage,
  hairAnalysis,
  setHairAnalysis,
  setSessionId
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageCapture = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setAnalyzing(true);

    // Display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend using the helper function
    try {
      const result = await uploadHairPhoto(file);
      
      if (result.success) {
        setSessionId(result.sessionId);
        setHairAnalysis(result.analysis);
        // Store sessionId for other components to use
        localStorage.setItem('untangle_session_id', result.sessionId);
      } else {
        setError(result.error);
        setCapturedImage(null); // Clear image on error
      }
    } catch (error) {
      // Handle unexpected errors (network failures, etc.)
      setError(error.message || 'An unexpected error occurred');
      setCapturedImage(null);
    } finally {
      setAnalyzing(false);
    }
  }, [setCapturedImage, setSessionId, setHairAnalysis]);

  const handleRetry = () => {
    setError(null);
    setCapturedImage(null);
    setHairAnalysis(null);
  };

  return (
    <div className="min-h-screen floral-bg text-[#7a2d45]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <header className="space-y-2">
          <span className="eyebrow">Guided analysis</span>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-medium text-[#7a2d45]">Hair Analysis</h1>
            <p className="text-sm text-[#8a4055]">
              Upload a clear photo so our AI can decode your texture and prep the perfect care path.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="space-y-6">
            <div className="soft-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="eyebrow">Step 1</p>
                  <h2 className="text-2xl font-display font-medium text-[#7a2d45]">Upload or snap a photo</h2>
                  <p className="text-sm text-[#8a4055]">
                    Natural light and full texture shots help us read your strands more accurately.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ffe8ee] flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#e8789a]" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />

              {capturedImage ? (
                <div className="rounded-2xl overflow-hidden border border-[#ffd0dc] bg-white/60">
                  <img 
                    src={capturedImage} 
                    alt="Captured hair" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#ffd0dc] rounded-2xl p-8 text-center bg-[#fff9f7]">
                  <Camera className="w-16 h-16 text-[#f4a7b9] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-[#7a2d45]">Take or upload a photo</h3>
                  <p className="text-sm text-[#8a4055] mb-6">
                    A quick selfie or back-of-head shot works - just keep the frame steady.
                  </p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={analyzing}
                    className="bg-[#e8789a] hover:bg-[#d4607f] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 mx-auto transition disabled:opacity-60"
                  >
                    <Upload className="w-5 h-5" />
                    Choose Photo
                  </button>
                </div>
              )}

              {capturedImage && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={analyzing}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#ffe8ee] text-[#e8789a] font-medium text-sm transition hover:bg-[#ffd0dc] disabled:opacity-60"
                  >
                    <Upload className="w-4 h-4" />
                    Replace photo
                  </button>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-[#ffd0dc] text-sm font-medium text-[#8a4055] hover:bg-white transition"
                  >
                    Remove photo
                  </button>
                </div>
              )}
            </div>

            {!capturedImage && (
              <div className="bg-white/70 border border-[#ffd0dc] rounded-[28px] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#e8789a] mb-4">Pro tips</p>
                <ul className="space-y-3 text-sm text-[#8a4055]">
                  <li className="flex gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                    Use natural lighting or stand near a window for softer details.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                    Include crown + length so we can see curl pattern and density.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                    Detangle lightly so frizz patterns don't hide your strands.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#e8789a]" />
                    Avoid harsh flash - it can flatten texture and trick the AI.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-[#fff6f6] border border-[#ffdede] rounded-[28px] p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffe6e6] flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-[#e05a5a]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#c44141] mb-2">We couldn't read that photo</h3>
                    <p className="text-sm text-[#7a5252] mb-4">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#e05a5a] text-white text-sm font-semibold hover:bg-[#c84b4b] transition"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!error && analyzing && (
              <div className="soft-card p-6 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-[#e8789a] border-t-transparent rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#7a2d45]">Analyzing your strands</h3>
                <p className="text-sm text-[#8a4055]">
                  Hang tight - we're measuring porosity, pattern, and current moisture balance.
                </p>
              </div>
            )}

            {!error && !analyzing && capturedImage && hairAnalysis && (
              <div className="soft-card p-6 space-y-5 shadow-sm">
                <div>
                  <p className="eyebrow">Results ready</p>
                  <h3 className="text-3xl font-display font-medium mt-2 text-[#7a2d45]">Analysis complete</h3>
                  <p className="text-sm text-[#8a4055]">
                    Here's what we found and how confident we feel about it.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#ffe8ee] p-4">
                    <h4 className="text-sm font-semibold text-[#e8789a] uppercase tracking-[0.18em] mb-1">
                      Hair type
                    </h4>
                    <p className="text-2xl font-display font-medium capitalize text-[#7a2d45]">
                      {hairAnalysis.hair_type || '--'}
                    </p>
                    <p className="text-xs text-[#8a4055] mt-1">
                      Confidence:{' '}
                      {typeof hairAnalysis.confidence === 'number'
                        ? `${(hairAnalysis.confidence * 100).toFixed(1)}%`
                        : '--'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fff9f7] p-4">
                    <h4 className="text-sm font-semibold text-[#b06070] uppercase tracking-[0.18em] mb-2">
                      Characteristics
                    </h4>
                    <ul className="space-y-2 text-sm text-[#7a2d45]">
                      {hairAnalysis.characteristics?.length ? (
                        hairAnalysis.characteristics.map((char, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-[#e8789a]">•</span>
                            {char}
                          </li>
                        ))
                      ) : (
                        <li>No extra notes provided.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigateToPage('plan')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#e8789a] hover:bg-[#d4607f] text-white py-4 font-semibold transition"
                  >
                    Get my custom plan
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRetry}
                    className="w-full inline-flex items-center justify-center rounded-full border border-[#ffd0dc] text-sm font-medium text-[#8a4055] py-3 hover:bg-white transition"
                  >
                    Analyze another photo
                  </button>
                </div>
              </div>
            )}

            {!error && !analyzing && (!capturedImage || !hairAnalysis) && (
              <div className="bg-white/70 border border-[#ffd0dc] rounded-[28px] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#e8789a] mb-2">What happens next</p>
                <p className="text-sm text-[#8a4055]">
                  Once you snap a photo, we'll auto-save your session so your care plan, style suggestions,
                  and tracking entries stay perfectly in sync.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HairAnalysis;
