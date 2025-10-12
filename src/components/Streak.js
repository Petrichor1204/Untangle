import { ChevronRight } from "lucide-react";
// Streak Component
function StreakCard({ onNavigate }) {
  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  const streakCount = 4;
  const completedDays = 4; // Number of completed days (M, T, W, Th are filled)
  
  const LightningIcon = () => (
    <svg className="w-4 h-4 text-yellow-800 fill-current " viewBox="0 0 24 24">
      <path d="M13 10V3L4 14H11V21L20 10H13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div 
      onClick={() => onNavigate('analysis')}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-8xl font-bold text-fuchsia-900">{streakCount}</span>
          <svg className="w-[5rem] h-[5rem] text-yellow-500 fill-current "  viewBox="0 0 24 24">

            <path d="M13 10V3L4 14H11V21L20 10H13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronRight className="w-12 h-10 mb-4 group-hover:scale-110 transition-transform" />
          {/* <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14m-7 0a7 7 0 100-14 7 7 0 000 14z" />
          </svg> */}
        </button>
      </div>

      <div className="flex justify-between gap-1">
        {days.map((day, index) => (
          <div key={day} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                index < completedDays 
                  ? 'bg-yellow-300' 
                  : index === completedDays 
                  ? 'bg-yellow-100' 
                  : 'bg-gray-200'
              }`}
            >
              {index < completedDays && <LightningIcon />}
            </div>
            <span className="text-xs text-gray-600 mt-1.5 font-medium">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default StreakCard
// Usage:
// <StreakCard onNavigate={navigateToPage} />