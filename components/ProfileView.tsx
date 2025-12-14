import React, { useMemo, useState } from 'react';
import { DayLog, Category } from '../types';
import { CATEGORIES } from '../constants';
import HistoryGrid from './HistoryGrid';
import MonthlyReflection from './MonthlyReflection';
import { format, parseISO } from 'date-fns';
import { Trophy, Calendar, TrendingUp, Activity, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  logs: DayLog[];
  streak: number;
  onReset: () => void;
}

const RESTART_QUOTES = [
  "Every moment is a fresh beginning. — T.S. Eliot",
  "Failure is simply the opportunity to begin again, this time more intelligently. — Henry Ford",
  "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
  "Rock bottom became the solid foundation on which I rebuilt my life. — J.K. Rowling",
  "The secret of getting ahead is getting started. — Mark Twain"
];

const ProfileView: React.FC<ProfileViewProps> = ({ logs, streak, onReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetQuote, setResetQuote] = useState('');

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    logs.forEach(log => {
      stats[log.category] = (stats[log.category] || 0) + 1;
    });
    return stats;
  }, [logs]);

  const maxCategoryCount = Math.max(...Object.values(categoryStats), 0);

  const handleResetClick = () => {
    const randomQuote = RESTART_QUOTES[Math.floor(Math.random() * RESTART_QUOTES.length)];
    setResetQuote(randomQuote);
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    onReset();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-full mb-2">
            <Trophy size={20} />
          </div>
          <span className="text-2xl font-black text-white">{streak}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Streak</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
           <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-full mb-2">
            <Calendar size={20} />
          </div>
          <span className="text-2xl font-black text-white">{logs.length}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Days</span>
        </div>
      </div>

      {/* Monthly Reflection Module */}
      <MonthlyReflection logs={logs} />

      {/* Recent Patterns Module */}
      <HistoryGrid logs={logs} />

      {/* Life Balance (Category Breakdown) */}
      <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
          Life Balance
        </h3>
        <div className="space-y-4">
          {CATEGORIES.filter(c => categoryStats[c.id] > 0).map(cat => {
             const count = categoryStats[cat.id] || 0;
             const percentage = maxCategoryCount > 0 ? (count / maxCategoryCount) * 100 : 0;
             
             return (
              <div key={cat.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`${cat.text} font-bold`}>{cat.label}</span>
                  <span className="text-slate-500">{count} days</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} opacity-80`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
             );
          })}
          {Object.keys(categoryStats).length === 0 && (
            <div className="text-center text-slate-600 text-xs italic py-4">
              No data yet. Log a day to see your breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Detailed Log History */}
      <div className="space-y-4">
         <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-1">
            Recent Logs
         </h3>
         {sortedLogs.slice(0, 10).map(log => {
             const category = CATEGORIES.find(c => c.id === log.category);
             return (
               <div key={log.id} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${category?.color || 'bg-slate-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wide ${category?.text || 'text-slate-400'}`}>
                        {category?.label}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {format(parseISO(log.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm truncate">{log.note}</p>
                    {log.reflection && (
                       <p className="text-slate-500 text-xs mt-2 italic border-l-2 border-slate-700 pl-2 line-clamp-2">
                         "{log.reflection}"
                       </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <div className="text-[10px] text-slate-600 uppercase">Mood</div>
                      <div className="flex gap-1">
                        <span className="text-xs" title="Before">{['😫','😕','😐','🙂','🤩'][log.moodBefore-1]}</span>
                        <span className="text-xs text-slate-600">→</span>
                        <span className="text-xs" title="After">{['😫','😕','😐','🙂','🤩'][log.moodAfter-1]}</span>
                      </div>
                  </div>
               </div>
             );
         })}
      </div>

      {/* Reset Section */}
      <div className="pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
        <p className="text-xs text-slate-600 text-center max-w-xs">
          Sometimes the bravest thing you can do is start from zero.
        </p>
        <button
          onClick={handleResetClick}
          className="group relative px-6 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400/80 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
            Reset Journey
          </span>
        </button>
      </div>

      {/* Motivational Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowResetModal(false)}></div>
          
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center space-y-6">
              <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                <Sparkles size={24} />
              </div>

              <blockquote className="text-lg md:text-xl font-serif italic text-slate-200 leading-relaxed">
                "{resetQuote}"
              </blockquote>

              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Clean Slate Protocol</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      This will permanently erase all your history, streaks, and reflections. This action cannot be undone. Are you ready to begin again?
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-3 rounded-xl text-slate-400 font-semibold text-sm hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Nevermind
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.02]"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileView;