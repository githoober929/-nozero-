import React, { useState, useMemo } from 'react';
import { DayLog, MonthlyStats } from '../types';
import { generateMonthlyReflection } from '../services/geminiService';
import { format, isSameMonth } from 'date-fns';
import { Sparkles, Mail } from 'lucide-react';

interface MonthlyReflectionProps {
  logs: DayLog[];
}

const MonthlyReflection: React.FC<MonthlyReflectionProps> = ({ logs }) => {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate stats for the current month
  const stats: MonthlyStats | null = useMemo(() => {
    const now = new Date();
    const currentMonthLogs = logs.filter(l => isSameMonth(new Date(l.date), now));
    
    if (currentMonthLogs.length < 3) return null; // Need some data to reflect on

    const categoryCounts: Record<string, number> = {};
    let lowEffortCount = 0;
    let hardestDayLog: DayLog | null = null;

    currentMonthLogs.forEach(log => {
      // Category count
      categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
      
      // Low effort count
      if (log.effort === 'easy') lowEffortCount++;

      // Find hardest day (assuming effort 'hard' or lowest mood change)
      if (log.effort === 'hard') {
          hardestDayLog = log;
      }
    });

    const mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

    return {
      totalDays: currentMonthLogs.length,
      mostCommonCategory,
      lowEffortCount,
      hardestDayNote: hardestDayLog?.note || "",
      monthName: format(now, 'MMMM')
    };
  }, [logs]);

  const handleGenerate = async () => {
    if (!stats) return;
    setLoading(true);
    const text = await generateMonthlyReflection(stats);
    setReflection(text);
    setLoading(false);
  };

  if (!stats) return null;

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      {!reflection ? (
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-all rounded-xl p-4 flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-400 group"
        >
          {loading ? (
             <Sparkles className="animate-spin" size={20} />
          ) : (
             <Mail size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
          )}
          <span className="text-sm font-medium">
            {loading ? "Writing your letter..." : `Open ${stats.monthName} Reflection`}
          </span>
        </button>
      ) : (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
           </div>
           <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
              From your calm mentor
           </h4>
           <div className="prose prose-invert prose-sm">
             <p className="text-slate-300 leading-relaxed italic font-serif opacity-90">
               "{reflection}"
             </p>
           </div>
           <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
              <span>{stats.totalDays} days logged in {stats.monthName}</span>
              <button onClick={() => setReflection(null)} className="hover:text-white transition-colors">Close</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReflection;