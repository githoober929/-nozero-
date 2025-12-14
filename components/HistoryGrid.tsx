import React from 'react';
import { DayLog } from '../types';
import { CATEGORIES } from '../constants';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

interface HistoryGridProps {
  logs: DayLog[];
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ logs }) => {
  const daysToShow = 14; 
  const today = new Date();

  const getLogForDay = (date: Date) => {
    return logs.find(log => isSameDay(parseISO(log.date), date));
  };

  const days = Array.from({ length: daysToShow }).map((_, i) => {
    const d = subDays(today, (daysToShow - 1) - i);
    const log = getLogForDay(d);
    return {
      date: d,
      log: log
    };
  });

  const getCategoryColor = (catId?: string) => {
    if (!catId) return 'bg-slate-800';
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.color : 'bg-slate-800';
  };

  return (
    <div className="mt-8 bg-slate-900/30 rounded-2xl p-6 border border-slate-800">
      <h3 className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
        Recent Patterns
      </h3>
      
      <div className="flex justify-center gap-2 sm:gap-3 mb-8">
        {days.map((day, idx) => {
          const isToday = isSameDay(day.date, today);
          const colorClass = getCategoryColor(day.log?.category);
          
          return (
            <div key={idx} className="flex flex-col items-center gap-2 group relative">
               <div 
                  className={`w-3 h-8 sm:w-4 sm:h-12 rounded-full transition-all duration-500 ${colorClass} ${
                    day.log ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : ''
                  }`}
                  title={day.log ? `${format(day.date, 'MMM do')}: ${day.log.category}` : format(day.date, 'MMM do')}
               ></div>
               <span className={`text-[10px] sm:text-xs font-medium ${isToday ? 'text-white' : 'text-slate-600'}`}>
                 {format(day.date, 'EEEEE')}
               </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.filter(c => c.id !== 'other').map(cat => (
          <div key={cat.id} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;