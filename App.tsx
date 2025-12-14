import React, { useState, useEffect, useCallback } from 'react';
import { DayLog, Category, Effort } from './types';
import { STORAGE_KEY } from './constants';
import { fetchMotivation } from './services/geminiService';
import StreakDisplay from './components/StreakDisplay';
import ActionLogger from './components/ActionLogger';
import MotivationCard from './components/MotivationCard';
import ProfileView from './components/ProfileView';
import BackgroundEffect from './components/BackgroundEffect';
import { parseISO, isSameDay, subDays, format } from 'date-fns';
import { Flame, User } from 'lucide-react';

type Tab = 'today' | 'profile';

const App: React.FC = () => {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [isDoneToday, setIsDoneToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [dailyQuote, setDailyQuote] = useState<string>('');

  // Calculate streak based on logs
  const calculateStreak = useCallback((currentLogs: DayLog[]) => {
    const today = new Date();
    const uniqueDays = new Set(
      currentLogs.map(log => format(parseISO(log.date), 'yyyy-MM-dd'))
    );

    // Check if done today
    const doneToday = uniqueDays.has(format(today, 'yyyy-MM-dd'));
    setIsDoneToday(doneToday);

    let currentStreak = 0;
    let checkDate = doneToday ? today : subDays(today, 1);

    while (uniqueDays.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }

    setStreak(currentStreak);
  }, []);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedLogs: DayLog[] = JSON.parse(savedData);
        // Sort logs by date just in case
        parsedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setLogs(parsedLogs);
        calculateStreak(parsedLogs);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setIsLoading(false);

    // Fetch daily quote
    const getDailyQuote = async () => {
      try {
        const result = await fetchMotivation();
        setDailyQuote(result.text);
      } catch (e) {
        console.error("Failed to fetch quote");
      }
    };
    
    getDailyQuote();
  }, [calculateStreak]);

  const handleLog = (data: {
    note: string;
    category: Category;
    effort: Effort;
    moodBefore: number;
    moodAfter: number;
    reflection: string;
  }) => {
    const newLog: DayLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      ...data
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    calculateStreak(updatedLogs);
  };

  const handleReset = () => {
    setLogs([]);
    setStreak(0);
    setIsDoneToday(false);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTab('today');
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-orange-500/30 selection:text-orange-200 relative">
      <BackgroundEffect />
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-6">
          <div className="flex-1">
             <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              No Zero Days
            </h1>
            {dailyQuote && activeTab === 'today' && (
              <p className="text-xs text-slate-500 mt-1 font-serif italic max-w-xs animate-in fade-in slide-in-from-top-2 duration-700">
                "{dailyQuote}"
              </p>
            )}
          </div>
          
          <div className="flex bg-slate-900/50 backdrop-blur-md p-1 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveTab('today')}
              className={`p-2 rounded-full transition-all duration-300 ${
                activeTab === 'today' 
                  ? 'bg-slate-700 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Flame size={20} className={activeTab === 'today' ? 'fill-orange-500 text-orange-500' : ''} />
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-full transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'bg-slate-700 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <User size={20} className={activeTab === 'profile' ? 'fill-indigo-500 text-indigo-500' : ''} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'today' ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
              <StreakDisplay streak={streak} isDoneToday={isDoneToday} />
              
              <div className="relative z-20">
                <ActionLogger onLog={handleLog} isDoneToday={isDoneToday} />
              </div>

              {!isDoneToday && (
                <div className="pt-8 border-t border-slate-800/50">
                  <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                    Stuck?
                  </p>
                  <MotivationCard />
                </div>
              )}
            </div>
          ) : (
            <ProfileView logs={logs} streak={streak} onReset={handleReset} />
          )}
        </main>

        <footer className="mt-12 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default">
                Build the wall
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;