import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import StreakCard from './Streak';
import { ChevronDown, BookMarked, Play } from 'lucide-react';

const Learn = ({ currentPage, navigateToPage, handleLogout }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const [hairTypeContent, setHairTypeContent] = useState({});

  useEffect(() => {
    fetch('/data/hair_types.json')
      .then(res => res.json())
      .then(data => setHairTypeContent(data));
  }, []);

  const SectionCard = ({ title, sectionKey, children }) => (
    <div className="soft-card overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-sm text-[#7a2d45]">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#e8789a] transition-transform ${
            expandedSection === sectionKey ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSection === sectionKey && (
        <div className="px-5 pb-5 border-t border-[#ffd0dc] text-sm space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const HairTypeCard = ({ type, data }) => (
    <SectionCard title={data.name} sectionKey={type}>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Characteristics</h4>
          <ul className="space-y-1 text-[#8a4055]">
            {data.characteristics.map((char, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#e8789a]">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-[#ffe8ee] px-4 py-3 text-[#7a2d45]">
          {data.moisture}
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Care routine</h4>
          <ul className="space-y-1 text-[#8a4055]">
            {data.routine.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#e8789a]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Common mistakes</h4>
          <ul className="space-y-1 text-[#8a4055]">
            {data.mistakes.map((mistake, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#e8789a]">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Trusted resources</h4>
          <ul className="space-y-1 text-[#8a4055]">
            {data.sources.map((source, idx) => (
              <li key={idx} className="flex gap-2">
                <BookMarked className="w-4 h-4 text-[#e8789a] mt-[2px]" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Recommended videos</h4>
          <div className="space-y-2">
            {data.videos.map((video, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#fff9f7] cursor-pointer hover:bg-[#ffe8ee] transition-colors"
              >
                <Play className="w-4 h-4 text-[#e8789a] flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#7a2d45]">{video.title}</p>
                  <p className="text-[11px] text-[#b06070]">by {video.creator}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );

  return (
    <div className="min-h-screen floral-bg text-[#7a2d45]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <span className="eyebrow">
            Learn
          </span>
          <h1 className="text-3xl font-display font-medium text-[#7a2d45]">Understand your hair, not just your products</h1>
          <p className="text-sm text-[#8a4055] max-w-2xl">
            Explore hair types, porosity, and density in simple lessons. Build a foundation so your routines
            actually make sense for your hair.
          </p>
        </header>

        {/* Top row: streak + learning overview */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <StreakCard onNavigate={navigateToPage} />
          </div>
          <div className="md:col-span-2 bg-white/80 border border-[#ffd0dc] rounded-2xl p-5 space-y-3 text-sm">
            <p className="eyebrow">
              Your learning path
            </p>
            <p className="font-medium text-[#7a2d45]">
              Start with hair type, then move into porosity and density.
            </p>
            <p className="text-xs text-[#8a4055]">
              You can take these in any order, but most people begin with identifying their curl pattern,
              then learning how their hair absorbs moisture, and finally understanding how much hair they
              actually have per area (density).
            </p>
            <div className="grid gap-2 text-[11px] sm:grid-cols-3">
              <div className="rounded-xl border border-[#ffd0dc] px-3 py-2 bg-[#fff9f7]">
                <p className="font-medium text-[#7a2d45] mb-1">Step 1 • Hair type</p>
                <p className="text-[#8a4055]">Curly, coily, straight or wavy basics.</p>
              </div>
              <div className="rounded-xl border border-[#ffd0dc] px-3 py-2 bg-[#fff9f7]">
                <p className="font-medium text-[#7a2d45] mb-1">Step 2 • Porosity</p>
                <p className="text-[#8a4055]">How your hair absorbs and holds moisture.</p>
              </div>
              <div className="rounded-xl border border-[#ffd0dc] px-3 py-2 bg-[#fff9f7]">
                <p className="font-medium text-[#7a2d45] mb-1">Step 3 • Density</p>
                <p className="text-[#8a4055]">How much hair you have per square inch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hair Types */}
        <section className="space-y-4">
          <h2 className="eyebrow text-[#b06070]">
            Hair type guide 🌷
          </h2>
          <div className="space-y-3">
            {Object.entries(hairTypeContent).map(([key, data]) => (
              <HairTypeCard key={key} type={key} data={data} />
            ))}
          </div>
        </section>

        {/* Porosity */}
        <section className="space-y-4">
          <h2 className="eyebrow text-[#b06070]">
            Porosity 💧
          </h2>
          <SectionCard title="Hair porosity basics" sectionKey="porosity">
            <div className="space-y-4 text-sm text-[#8a4055]">
              <p className="text-[#7a2d45]">
                Hair porosity is how easily your hair absorbs and retains water and products. It's
                shaped by your cuticle layer and can change with heat, color, and damage.
              </p>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Low porosity</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Water and products tend to sit on top of the hair.</li>
                  <li>• Hair can take a long time to get fully wet.</li>
                  <li>• Often dries slowly.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Focus on lightweight, water-based products and use gentle heat during treatments to help
                  products penetrate.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">High porosity</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Hair soaks up water quickly.</li>
                  <li>• Dries fast but often feels rough or frizzy.</li>
                  <li>• Can lose moisture just as quickly as it absorbs it.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Lean on richer creams, oils, and regular protein treatments to help with strength and
                  moisture retention.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Medium / balanced porosity</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Holds styles relatively well.</li>
                  <li>• Accepts moisture without too much struggle.</li>
                  <li>• Often feels soft with a healthy sheen.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Maintain balance with both moisture and occasional protein, plus consistent basic care.
                </p>
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Density */}
        <section className="space-y-4 pb-8">
          <h2 className="eyebrow text-[#b06070]">
            Density 👆
          </h2>
          <SectionCard title="Hair density overview" sectionKey="density">
            <div className="space-y-4 text-sm text-[#8a4055]">
              <p className="text-[#7a2d45]">
                Density describes how many strands you have in a given area on your scalp. It's about how
                full your hair looks, not the thickness of each strand.
              </p>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Low density</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Scalp is more visible, especially when hair is wet.</li>
                  <li>• Hair can look fine or thin, even if strands are thick.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Use lightweight products, focus on root volume, and avoid heavy buildup that flattens
                  the hair.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">High density</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Hair feels very full and thick.</li>
                  <li>• Scalp is rarely visible.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Work in sections, use enough product to coat strands, and give styles extra time to dry.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#7a2d45] text-sm">Medium density</h4>
                <ul className="space-y-1 ml-1 text-[#8a4055]">
                  <li>• Balanced fullness and movement.</li>
                  <li>• Holds styles without feeling too bulky.</li>
                </ul>
                <p className="mt-2 text-xs text-[#8a4055]">
                  Adjust product amount based on style: lighter for volume, richer for definition.
                </p>
              </div>
            </div>
          </SectionCard>
        </section>
      </div>
    </div>
  );
};

export default Learn;
