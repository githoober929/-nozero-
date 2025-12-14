import React from 'react';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  isDoneToday: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, isDoneToday }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 relative">
      <div className={`relative transition-all duration-700 ${isDoneToday ? 'scale-110' : 'scale-100'}`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 blur-3xl rounded-full opacity-40 transition-colors duration-500 ${isDoneToday ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 rounded-full border-4 mb-4 ${isDoneToday ? 'border-orange-500 bg-orange-500/20 text-orange-500' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                <Flame size={64} fill={isDoneToday ? "currentColor" : "none"} className={`transition-all duration-500 ${isDoneToday ? 'animate-pulse' : ''}`} />
            </div>
          <h1 className="text-8xl font-black tracking-tighter text-white tabular-nums">
            {streak}
          </h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase mt-2 text-sm">
            Day Streak
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakDisplay;