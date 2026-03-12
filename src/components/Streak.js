import { ChevronRight } from "lucide-react";
import { getStreakData, getWeekActivity, getTodayIndex, getCoins } from "../utils/streakUtils";

function StreakCard({ onNavigate }) {
  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  const streakData = getStreakData();
  const streakCount = streakData.streakCount || 0;
  const weekActivity = getWeekActivity();   // boolean[7] Mon–Sun
  const todayIndex  = getTodayIndex();      // 0=Mon … 6=Sun
  const coins = getCoins();

  const FlowerIcon = () => (
    <span className="text-sm leading-none select-none">🌸</span>
  );

  return (
    <div
      onClick={() => onNavigate('tracking')}
      className="bg-white border border-[#ffd0dc] rounded-[28px] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-6 petal-pulse"
    >
      <div className="flex items-center justify-between mb-1">
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

      {/* Coins row */}
      <div className="flex items-center gap-1 mb-4 ml-1">
        <span className="text-base leading-none">🪙</span>
        <span className="text-sm font-semibold text-[#b06070]">{coins.toLocaleString()}</span>
        <span className="text-xs text-[#c08090]">coins earned</span>
      </div>

      {/* Week strip */}
      <div className="flex justify-between gap-1">
        {days.map((day, index) => {
          const isActive  = weekActivity[index];
          const isToday   = index === todayIndex;
          return (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'petal-icon bg-[#ffe8ee]'
                    : isToday
                    ? 'rounded-full bg-[#fff0f5] border-2 border-[#e8789a]'
                    : 'rounded-full bg-[#fafafa] border border-[#f0e0e5]'
                }`}
              >
                {isActive && <FlowerIcon />}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-medium ${
                  isToday ? 'text-[#e8789a]' : 'text-[#b06070]'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StreakCard;
