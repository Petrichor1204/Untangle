import React, { useState } from 'react';
import Navigation from './Navigation';
import StreakCard from './Streak';
import { ChevronDown, BookMarked, Play } from 'lucide-react';

const Learn = ({ currentPage, navigateToPage, handleLogout }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hairTypeContent = {
    type4: {
      name: 'Type 4 (Coily/Kinky)',
      color: 'from-amber-400 to-amber-600',
      characteristics: [
        'Tight coils or zig-zag pattern',
        'Naturally drier due to oil distribution challenges',
        'High shrinkage (30-70%)',
        'Prone to frizz and breakage',
        'Unique texture variation within the hair'
      ],
      moisture: 'Requires frequent deep hydration and moisture-locking techniques',
      routine: [
        'LOC Method (Leave-in, Oil, Cream) for moisture sealing',
        'Weekly deep conditioning (at least 2-3 times weekly)',
        'Gentle detangling on wet hair with conditioner',
        'Low manipulation styling to reduce breakage',
        'Protective styling when needed'
      ],
      mistakes: [
        'Using products with sulfates and silicones',
        'Excessive heat styling',
        'Skipping moisturizing steps',
        'Using regular combs instead of wide-tooth combs',
        'Stretching hair when wet'
      ],
      sources: [
        'Naptural85 (YouTube channel)',
        'The Book of Kink by Nikki Ransom',
        'Natural Hair Care studies from Howard University'
      ],
      videos: [
        { title: 'Type 4 Hair Care Basics', creator: 'Naptural85' },
        { title: 'How to Maintain Coily Hair', creator: 'Talia Iman' },
        { title: 'The Science of Natural Hair', creator: 'Dr. Lois Lockhart' }
      ]
    },
    type3: {
      name: 'Type 3 (Curly)',
      color: 'from-rose-400 to-rose-600',
      characteristics: [
        'Well-defined curls with bouncy texture',
        'More shine than Type 4 but less than Type 2',
        'Moderate shrinkage (15-30%)',
        'Curls range from loose waves to tight ringlets',
        'Prone to frizz but less than coily hair'
      ],
      moisture: 'Benefits from regular hydration and curl-enhancing products',
      routine: [
        'LCO Method (Leave-in, Cream, Oil)',
        'Weekly deep conditioning',
        'Curl-enhancing creams and gels',
        'Plopping technique for curl definition',
        'Microfiber towels to reduce frizz'
      ],
      mistakes: [
        'Using heavy products that weigh curls down',
        'Over-washing which strips natural oils',
        'Brushing dry curls',
        'Ignoring protein treatments',
        'Using regular towels (causes frizz)'
      ],
      sources: [
        'CurlyGirl Method by Lorraine Massey',
        'Mielle Organics educational resources',
        'International Journal of Cosmetic Science studies'
      ],
      videos: [
        { title: 'Curly Hair Routine for Type 3', creator: 'Jess Arevalo' },
        { title: 'Defining Your Curls', creator: 'Tiana Cosby' },
        { title: 'Best Products for Curl Definition', creator: 'Alicia Rose' }
      ]
    },
    type2: {
      name: 'Type 2 (Wavy)',
      color: 'from-blue-400 to-blue-600',
      characteristics: [
        'Waves with loose S-shaped pattern',
        'Natural shine and movement',
        'Low shrinkage (5-15%)',
        'More manageable than curly or coily hair',
        'Can appear frizzy or limp without proper care'
      ],
      moisture: 'Needs lightweight hydration to avoid flatness',
      routine: [
        'Lightweight leave-in conditioners',
        'Wave-enhancing mousses and gels',
        'Bi-weekly deep conditioning',
        'Co-washing for gentle cleansing',
        'Diffuser drying for volume'
      ],
      mistakes: [
        'Using too-heavy products',
        'Over-conditioning which causes flatness',
        'Skipping protein treatments',
        'Rough drying techniques',
        'Using hot water for washing'
      ],
      sources: [
        'Wavy Hair Careguide by Ouidad',
        'Cantu Shea Butter educational content',
        'Natural Hair Academy resources'
      ],
      videos: [
        { title: 'Wavy Hair Routine for Beginners', creator: 'Mimi Ito' },
        { title: 'How to Enhance Your Waves', creator: 'Kels' },
        { title: 'Wavy Hair Products That Work', creator: 'Moniluxx' }
      ]
    },
    type1: {
      name: 'Type 1 (Straight)',
      color: 'from-green-400 to-green-600',
      characteristics: [
        'Straight hair from root to tip',
        'Maximum shine and natural movement',
        'No shrinkage',
        'Can appear flat or limp',
        'Oil distributes easily throughout hair'
      ],
      moisture: 'Minimal moisture needs; focus on volume and texture',
      routine: [
        'Lightweight conditioners (focus on ends)',
        'Monthly deep conditioning treatments',
        'Volumizing products at roots',
        'Regular trims for shape maintenance',
        'Minimal product buildup management'
      ],
      mistakes: [
        'Over-conditioning causing flatness',
        'Using heavy oils throughout hair',
        'Not protecting ends from damage',
        'Excessive heat styling without heat protectant',
        'Ignoring scalp health'
      ],
      sources: [
        'Hair Science basics from dermatology studies',
        'SheaMoisture educational guides',
        'Professional hairstylist recommendations'
      ],
      videos: [
        { title: 'Straight Hair Care Guide', creator: 'Shayla Madison' },
        { title: 'Adding Texture to Straight Hair', creator: 'Labaih' },
        { title: 'Maintaining Straight Hair Health', creator: 'Jackie Aina' }
      ]
    }
  };

  const HairTypeCard = ({ type, data }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className={`bg-gradient-to-r ${data.color} p-6 text-white cursor-pointer`}
           onClick={() => toggleSection(type)}>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{data.name}</h3>
          <ChevronDown 
            className={`w-6 h-6 transition-transform ${expandedSection === type ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      
      {expandedSection === type && (
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">Characteristics</h4>
            <ul className="space-y-2">
              {data.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900 font-semibold">{data.moisture}</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">Care Routine</h4>
            <ul className="space-y-2">
              {data.routine.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">Common Mistakes to Avoid</h4>
            <ul className="space-y-2">
              {data.mistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">Trusted Resources</h4>
            <ul className="space-y-2">
              {data.sources.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <BookMarked className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">Recommended Videos</h4>
            <div className="space-y-3">
              {data.videos.map((video, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <Play className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{video.title}</p>
                    <p className="text-sm text-gray-600">by {video.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation 
        currentPage={currentPage} 
        navigateToPage={navigateToPage} 
        handleLogout={handleLogout} 
      />
      
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-lg font-bold text-gray-800">Welcome, Euphoria</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StreakCard onNavigate={navigateToPage} />
        </div>

        {/* Hair Types Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Hair Type Guide</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(hairTypeContent).map(([key, data]) => (
              <HairTypeCard key={key} type={key} data={data} />
            ))}
          </div>
        </div>

        {/* Porosity Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-6 text-white cursor-pointer"
               onClick={() => toggleSection('porosity')}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Hair Porosity</h3>
              <ChevronDown 
                className={`w-6 h-6 transition-transform ${expandedSection === 'porosity' ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          
          {expandedSection === 'porosity' && (
            <div className="p-6 space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-900">Hair porosity refers to your hair's ability to absorb and retain moisture. It's determined by the state of your hair cuticles and greatly affects how your hair responds to products and treatments.</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">Low Porosity Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Water beads on hair surface</li>
                      <li>• Slow to dry</li>
                      <li>• Products sit on hair</li>
                      <li>• Prone to product buildup</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Use lightweight, water-based products</li>
                      <li>• Apply products to soaking wet hair</li>
                      <li>• Use heat to open cuticles during treatments</li>
                      <li>• Avoid heavy oils and butters</li>
                      <li>• Co-wash to avoid sulfate buildup</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">High Porosity Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Water absorbs quickly</li>
                      <li>• Hair dries fast</li>
                      <li>• Hair feels rough or dry</li>
                      <li>• Frizz and breakage issues</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Use protein treatments regularly</li>
                      <li>• Seal moisture with oils and creams</li>
                      <li>• Use heavier products to lock in moisture</li>
                      <li>• Rinse with cool water to close cuticles</li>
                      <li>• Deep condition weekly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">Normal/Medium Porosity Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Good moisture retention</li>
                      <li>• Holds style well</li>
                      <li>• Healthy shine and elasticity</li>
                      <li>• Minimal frizz</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Maintain balance with varied products</li>
                      <li>• Deep condition bi-weekly</li>
                      <li>• Use both moisture and protein</li>
                      <li>• Consistent maintenance routine</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Density Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 text-white cursor-pointer"
               onClick={() => toggleSection('density')}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Hair Density</h3>
              <ChevronDown 
                className={`w-6 h-6 transition-transform ${expandedSection === 'density' ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          
          {expandedSection === 'density' && (
            <div className="p-6 space-y-6">
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-teal-900">Hair density refers to how many hair strands you have per square inch on your scalp. It's different from porosity and affects how much volume your hair has and how much product you need.</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">Low Density Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Scalp is visible, especially when wet</li>
                      <li>• Hair appears thin</li>
                      <li>• Limited volume and body</li>
                      <li>• Styles fall flat quickly</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Use lightweight products to avoid weighing hair down</li>
                      <li>• Use volumizing mousses and gels</li>
                      <li>• Avoid heavy oils and butters</li>
                      <li>• Try protective styles that create fullness</li>
                      <li>• Consider scalp stimulation exercises</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">High Density Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Thick hair with lots of volume</li>
                      <li>• Scalp not visible</li>
                      <li>• Styles hold well</li>
                      <li>• May be difficult to style</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Use heavier products to define curls/coils</li>
                      <li>• Deep condition more frequently</li>
                      <li>• Section hair into smaller parts when styling</li>
                      <li>• Allow extra drying time</li>
                      <li>• Use richer leave-ins and creams</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-800">Medium/Normal Density Hair</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Signs:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Good volume without being too thick</li>
                      <li>• Balanced fullness</li>
                      <li>• Styles hold well</li>
                      <li>• Versatile styling options</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Care Tips:</p>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Use a balance of lightweight and rich products</li>
                      <li>• Deep condition bi-weekly</li>
                      <li>• Layer products based on needs</li>
                      <li>• Maintain consistent routines</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;