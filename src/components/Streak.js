import { ChevronRight } from "lucide-react";

function StreakCard({ onNavigate }) {
  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  const streakCount = 4;
  const completedDays = 4;

  const FlowerIcon = () => (
    <span className="text-sm leading-none select-none">🌸</span>
  );

  return (
    <div
      onClick={() => onNavigate('analysis')}
      className="bg-white border border-[#ffd0dc] rounded-[28px] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-6 petal-pulse"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-7xl font-bold text-[#e8789a]">{streakCount}</span>
          <div className="flex flex-col">
            <span className="text-4xl leading-none">🌺</span>
            <span className="text-xs text-[#b06070] font-medium mt-1">day streak</span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-[#ffe8ee] transition-colors">
          <ChevronRight className="w-6 h-6 text-[#e8789a]" />
        </button>
      </div>

      <div className="flex justify-between gap-1">
        {days.map((day, index) => (
          <div key={day} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center transition-colors ${
                index < completedDays
                  ? 'petal-icon bg-[#ffe8ee]'
                  : index === completedDays
                  ? 'rounded-full bg-[#fff5f0] border border-[#ffd0dc]'
                  : 'rounded-full bg-[#fafafa] border border-[#f0e0e5]'
              }`}
            >
              {index < completedDays && <FlowerIcon />}
            </div>
            <span className="text-[11px] text-[#b06070] mt-1.5 font-medium">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreakCard;
