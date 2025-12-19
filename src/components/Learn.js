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
  // const hairTypeContent = {
  //   type4: {
  //     name: 'Type 4 (Coily / Kinky)',
  //     characteristics: [
  //       'Tight coils or zig-zag pattern',
  //       'Naturally drier due to oil distribution challenges',
  //       'High shrinkage (30-70%)',
  //       'Prone to frizz and breakage',
  //       'Unique texture variation within the hair'
  //     ],
  //     moisture: 'Requires frequent deep hydration and moisture-locking techniques.',
  //     routine: [
  //       'Use LOC Method (Leave-in, Oil, Cream) for moisture sealing.',
  //       'Deep condition at least weekly.',
  //       'Gently detangle on wet hair with slip from conditioner.',
  //       'Use low manipulation styling to reduce breakage.',
  //       'Incorporate protective styles when needed.'
  //     ],
  //     mistakes: [
  //       'Using products with harsh sulfates and heavy silicones.',
  //       'Excessive heat styling.',
  //       'Skipping moisturizing steps.',
  //       'Using small-toothed combs instead of wide-tooth tools.',
  //       'Roughly stretching hair when wet.'
  //     ],
  //     sources: [
  //       'Naptural85 (YouTube channel)',
  //       'The Book of Kink by Nikki Ransom',
  //       'Natural Hair Care studies from Howard University'
  //     ],
  //     videos: [
  //       { title: 'Type 4 Hair Care Basics', creator: 'Naptural85' },
  //       { title: 'How to Maintain Coily Hair', creator: 'Talia Iman' },
  //       { title: 'The Science of Natural Hair', creator: 'Dr. Lois Lockhart' }
  //     ]
  //   },
  //   type3: {
  //     name: 'Type 3 (Curly)',
  //     characteristics: [
  //       'Well-defined curls with a bouncy texture',
  //       'Moderate shine, more than Type 4 but less than Type 2',
  //       'Moderate shrinkage (15–30%)',
  //       'Curls range from loose spirals to tight ringlets',
  //       'Prone to frizz without moisture and definition'
  //     ],
  //     moisture: 'Benefits from regular hydration and curl-enhancing products.',
  //     routine: [
  //       'Try LCO Method (Leave-in, Cream, Oil).',
  //       'Deep condition weekly.',
  //       'Use curl creams and gels for definition.',
  //       'Use gentle drying methods like plopping.',
  //       'Use microfiber towels or cotton T-shirts.'
  //     ],
  //     mistakes: [
  //       'Using heavy products that weigh curls down.',
  //       'Over-washing, which strips natural oils.',
  //       'Brushing dry curls.',
  //       'Ignoring protein treatments.',
  //       'Using rough, standard towels.'
  //     ],
  //     sources: [
  //       'CurlyGirl Method by Lorraine Massey',
  //       'Mielle Organics educational resources',
  //       'International Journal of Cosmetic Science studies'
  //     ],
  //     videos: [
  //       { title: 'Curly Hair Routine for Type 3', creator: 'Jess Arevalo' },
  //       { title: 'Defining Your Curls', creator: 'Tiana Cosby' },
  //       { title: 'Best Products for Curl Definition', creator: 'Alicia Rose' }
  //     ]
  //   },
  //   type2: {
  //     name: 'Type 2 (Wavy)',
  //     characteristics: [
  //       'Waves with a loose S-shaped pattern',
  //       'Natural shine and movement',
  //       'Low shrinkage (5–15%)',
  //       'Generally easier to manage than tighter curls or coils',
  //       'Can look frizzy or limp without balanced care'
  //     ],
  //     moisture: 'Needs lightweight hydration to avoid flatness.',
  //     routine: [
  //       'Use lightweight leave-in conditioners.',
  //       'Use wave-enhancing mousses and gels.',
  //       'Deep condition every couple of weeks.',
  //       'Incorporate co-washing if scalp allows.',
  //       'Use a diffuser for gentle volume.'
  //     ],
  //     mistakes: [
  //       'Using overly heavy products.',
  //       'Over-conditioning, leading to flat roots.',
  //       'Skipping protein when hair feels mushy.',
  //       'Rough drying with hot air.',
  //       'Using very hot water to wash.'
  //     ],
  //     sources: [
  //       'Wavy Hair Care guide by Ouidad',
  //       'Cantu Shea Butter educational content',
  //       'Natural Hair Academy resources'
  //     ],
  //     videos: [
  //       { title: 'Wavy Hair Routine for Beginners', creator: 'Mimi Ito' },
  //       { title: 'How to Enhance Your Waves', creator: 'Kels' },
  //       { title: 'Wavy Hair Products That Work', creator: 'Moniluxx' }
  //     ]
  //   },
  //   type1: {
  //     name: 'Type 1 (Straight)',
  //     characteristics: [
  //       'Straight hair from root to tip',
  //       'High natural shine and movement',
  //       'No shrinkage',
  //       'Can appear flat or limp',
  //       'Oil distributes easily through the hair shaft'
  //     ],
  //     moisture: 'Minimal moisture needs; more focus on volume, texture, and scalp health.',
  //     routine: [
  //       'Use lightweight conditioners focused on the ends.',
  //       'Deep condition monthly or as needed.',
  //       'Use volumizing products at the roots.',
  //       'Schedule regular trims for shape and health.',
  //       'Avoid heavy buildup from styling products.'
  //     ],
  //     mistakes: [
  //       'Over-conditioning, causing flatness.',
  //       'Using heavy oils on the full length.',
  //       'Skipping heat protectant when styling.',
  //       'Ignoring itchy or oily scalp signs.',
  //       'Using too many heavy serums.'
  //     ],
  //     sources: [
  //       'Dermatology-based hair science basics',
  //       'SheaMoisture educational guides',
  //       'Professional hairstylist recommendations'
  //     ],
  //     videos: [
  //       { title: 'Straight Hair Care Guide', creator: 'Shayla Madison' },
  //       { title: 'Adding Texture to Straight Hair', creator: 'Labaih' },
  //       { title: 'Maintaining Straight Hair Health', creator: 'Jackie Aina' }
  //     ]
  //   }
  // };

  const SectionCard = ({ title, sectionKey, children }) => (
    <div className="bg-[#221a33] border border-[#3b2a5f] rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-sm">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#a78bfa] transition-transform ${
            expandedSection === sectionKey ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSection === sectionKey && (
        <div className="px-5 pb-5 border-t border-[#3b2a5f] text-sm space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const HairTypeCard = ({ type, data }) => (
    <SectionCard title={data.name} sectionKey={type}>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-gray-100 text-sm">Characteristics</h4>
          <ul className="space-y-1 text-gray-200/90">
            {data.characteristics.map((char, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#a78bfa]">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-black/20 px-4 py-3 text-gray-100">
          {data.moisture}
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-100 text-sm">Care routine</h4>
          <ul className="space-y-1 text-gray-200/90">
            {data.routine.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#a78bfa]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-100 text-sm">Common mistakes</h4>
          <ul className="space-y-1 text-gray-200/90">
            {data.mistakes.map((mistake, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#a78bfa]">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-100 text-sm">Trusted resources</h4>
          <ul className="space-y-1 text-gray-200/90">
            {data.sources.map((source, idx) => (
              <li key={idx} className="flex gap-2">
                <BookMarked className="w-4 h-4 text-[#a78bfa] mt-[2px]" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-100 text-sm">Recommended videos</h4>
          <div className="space-y-2">
            {data.videos.map((video, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
              >
                <Play className="w-4 h-4 text-[#a78bfa] flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-100">{video.title}</p>
                  <p className="text-[11px] text-gray-300/80">by {video.creator}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );

  return (
    <div className="min-h-screen bg-[#1a1423] text-[#f2f2f2]">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#a78bfa]/80">
            Learn
          </span>
          <h1 className="text-2xl font-semibold">Understand your hair, not just your products</h1>
          <p className="text-sm text-gray-300/80 max-w-2xl">
            Explore hair types, porosity, and density in simple lessons. Build a foundation so your routines
            actually make sense for your hair.
          </p>
        </header>

        {/* Top row: streak + learning overview */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <StreakCard onNavigate={navigateToPage} />
          </div>
          <div className="md:col-span-2 bg-[#221a33] border border-[#3b2a5f] rounded-2xl p-5 space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-300/70">
              Your learning path
            </p>
            <p className="font-medium text-gray-100">
              Start with hair type, then move into porosity and density.
            </p>
            <p className="text-xs text-gray-300/80">
              You can take these in any order, but most people begin with identifying their curl pattern,
              then learning how their hair absorbs moisture, and finally understanding how much hair they
              actually have per area (density).
            </p>
            <div className="grid gap-2 text-[11px] sm:grid-cols-3">
              <div className="rounded-xl border border-[#3b2a5f] px-3 py-2">
                <p className="font-medium text-gray-100 mb-1">Step 1 • Hair type</p>
                <p className="text-gray-300/80">Curly, coily, straight or wavy basics.</p>
              </div>
              <div className="rounded-xl border border-[#3b2a5f] px-3 py-2">
                <p className="font-medium text-gray-100 mb-1">Step 2 • Porosity</p>
                <p className="text-gray-300/80">How your hair absorbs and holds moisture.</p>
              </div>
              <div className="rounded-xl border border-[#3b2a5f] px-3 py-2">
                <p className="font-medium text-gray-100 mb-1">Step 3 • Density</p>
                <p className="text-gray-300/80">How much hair you have per square inch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hair Types */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
            Hair type guide
          </h2>
          <div className="space-y-3">
            {Object.entries(hairTypeContent).map(([key, data]) => (
              <HairTypeCard key={key} type={key} data={data} />
            ))}
          </div>
        </section>

        {/* Porosity */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
            Porosity
          </h2>
          <SectionCard title="Hair porosity basics" sectionKey="porosity">
            <div className="space-y-4 text-sm text-gray-200/90">
              <p className="text-gray-200">
                Hair porosity is how easily your hair absorbs and retains water and products. It’s
                shaped by your cuticle layer and can change with heat, color, and damage.
              </p>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">Low porosity</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Water and products tend to sit on top of the hair.</li>
                  <li>• Hair can take a long time to get fully wet.</li>
                  <li>• Often dries slowly.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
                  Focus on lightweight, water-based products and use gentle heat during treatments to help
                  products penetrate.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">High porosity</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Hair soaks up water quickly.</li>
                  <li>• Dries fast but often feels rough or frizzy.</li>
                  <li>• Can lose moisture just as quickly as it absorbs it.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
                  Lean on richer creams, oils, and regular protein treatments to help with strength and
                  moisture retention.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">Medium / balanced porosity</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Holds styles relatively well.</li>
                  <li>• Accepts moisture without too much struggle.</li>
                  <li>• Often feels soft with a healthy sheen.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
                  Maintain balance with both moisture and occasional protein, plus consistent basic care.
                </p>
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Density */}
        <section className="space-y-4 pb-8">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-300/80">
            Density
          </h2>
          <SectionCard title="Hair density overview" sectionKey="density">
            <div className="space-y-4 text-sm text-gray-200/90">
              <p>
                Density describes how many strands you have in a given area on your scalp. It’s about how
                full your hair looks, not the thickness of each strand.
              </p>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">Low density</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Scalp is more visible, especially when hair is wet.</li>
                  <li>• Hair can look fine or thin, even if strands are thick.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
                  Use lightweight products, focus on root volume, and avoid heavy buildup that flattens
                  the hair.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">High density</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Hair feels very full and thick.</li>
                  <li>• Scalp is rarely visible.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
                  Work in sections, use enough product to coat strands, and give styles extra time to dry.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-100 text-sm">Medium density</h4>
                <ul className="space-y-1 ml-1">
                  <li>• Balanced fullness and movement.</li>
                  <li>• Holds styles without feeling too bulky.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-300/80">
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
