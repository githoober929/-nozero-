import React, { useState } from 'react';
import { Check, Plus, ChevronRight, ChevronLeft, Heart, Battery, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, Effort } from '../types';
import { CATEGORIES } from '../constants';

interface ActionLoggerProps {
  onLog: (data: {
    note: string;
    category: Category;
    effort: Effort;
    moodBefore: number;
    moodAfter: number;
    reflection: string;
  }) => void;
  isDoneToday: boolean;
}

const MoodSelector = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
    <div className="flex justify-between bg-slate-900 p-2 rounded-xl">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            value === v ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110' : 'text-slate-600 hover:bg-slate-800'
          }`}
        >
          {v === 1 ? '😫' : v === 2 ? '😕' : v === 3 ? '😐' : v === 4 ? '🙂' : '🤩'}
        </button>
      ))}
    </div>
  </div>
);

const ActionLogger: React.FC<ActionLoggerProps> = ({ onLog, isDoneToday }) => {
  const [step, setStep] = useState(0); // 0: Idle, 1: What/Cat, 2: Effort/Mood, 3: Reflection
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [effort, setEffort] = useState<Effort>('easy');
  const [moodBefore, setMoodBefore] = useState(3);
  const [moodAfter, setMoodAfter] = useState(4);
  const [reflection, setReflection] = useState('');

  const handleComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#ffffff']
    });
    
    onLog({
      note,
      category,
      effort,
      moodBefore,
      moodAfter,
      reflection
    });
    setStep(0);
    // Reset state
    setNote('');
    setCategory('other');
    setEffort('easy');
    setMoodBefore(3);
    setMoodAfter(4);
    setReflection('');
  };

  if (isDoneToday) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900/50 border border-emerald-500/20 rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm">
        <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/40">
          <Check size={32} className="text-emerald-400" strokeWidth={3} />
        </div>
        <h3 className="text-xl font-bold text-emerald-400">Day Recorded</h3>
        <p className="text-slate-400 text-center mt-2 text-sm max-w-[200px]">You've added your brick to the wall. Rest easy.</p>
      </div>
    );
  }

  if (step === 0) {
    return (
      <button
        onClick={() => setStep(1)}
        className="group w-full max-w-md mx-auto py-6 bg-slate-100 hover:bg-white text-slate-900 rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
      >
        <Plus className="group-hover:rotate-90 transition-transform duration-500" />
        Log Your Win
      </button>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      
      {/* Progress Bar */}
      <div className="flex h-1 bg-slate-900">
        <div className="bg-orange-500 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">What was your non-zero action?</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Read 5 pages..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      category === cat.id 
                        ? `${cat.color} text-white border-transparent shadow-md` 
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                disabled={!note.trim()}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Effort Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as Effort[]).map((eff) => (
                  <button
                    key={eff}
                    onClick={() => setEffort(eff)}
                    className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                      effort === eff
                        ? 'bg-slate-700 border-slate-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {eff}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <MoodSelector label="Mood Before" value={moodBefore} onChange={setMoodBefore} />
               <MoodSelector label="Mood After" value={moodAfter} onChange={setMoodAfter} />
            </div>

            <div className="flex justify-between pt-2">
               <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white transition-colors p-2">
                  <ChevronLeft />
               </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Brain size={16} className="text-orange-400"/>
                     <label className="text-sm font-medium text-slate-400">One sentence reflection</label>
                  </div>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value.slice(0, 120))}
                    placeholder="How did this action make you feel?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-none"
                  />
                  <div className="text-right text-xs text-slate-600 mt-1">
                     {reflection.length}/120
                  </div>
               </div>

               <div className="flex justify-between pt-2">
                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-white transition-colors p-2">
                    <ChevronLeft />
                </button>
                <button
                    onClick={handleComplete}
                    className="flex-1 ml-4 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                >
                    Complete Day
                </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ActionLogger;
