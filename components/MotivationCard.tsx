import React, { useState } from 'react';
import { Sparkles, Lightbulb, RefreshCw, Quote, ArrowRight, X } from 'lucide-react';
import { fetchMotivation } from '../services/geminiService';
import { MotivationResponse, MotivationType } from '../types';

const MotivationCard: React.FC = () => {
  const [data, setData] = useState<MotivationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getIdea = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchMotivation();
      setData(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const clearCard = () => {
    setData(null);
  };

  // Idle State (Floating Button)
  if (!data && !loading && !error) {
    return (
      <div className="text-center mt-12 mb-8 animate-float">
        <button
          onClick={getIdea}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 overflow-hidden font-medium transition-all rounded-2xl backdrop-blur-md"
        >
          {/* Animated Gradient Border Background */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-orange-500 to-indigo-500 animate-shimmer opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Inner dark background to create border effect */}
          <div className="absolute inset-[2px] bg-slate-950 rounded-[14px]"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 text-slate-200 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold tracking-wide uppercase text-sm">Need a Spark?</span>
          </div>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-2xl"></div>
        </button>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col items-center justify-center min-h-[200px] animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin mb-4"></div>
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">Igniting...</p>
      </div>
    );
  }

  // Content State
  return (
    <div className="w-full max-w-md mx-auto mt-8 relative group perspective-1000">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 transition-all hover:border-slate-700 hover:shadow-orange-500/10 hover:-translate-y-1">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-12 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 p-12 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full blur-2xl -ml-10 -mb-10"></div>

        {/* Close Button */}
        <button 
            onClick={clearCard}
            className="absolute top-4 right-4 text-slate-600 hover:text-slate-400 transition-colors"
        >
            <X size={16} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          {data?.type === MotivationType.QUOTE ? (
            <>
              <div className="mb-6 p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                <Quote size={24} className="fill-current" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif italic leading-relaxed text-slate-200 mb-6">
                "{data.text}"
              </h3>
            </>
          ) : (
            <>
              <div className="mb-6 p-3 bg-orange-500/10 text-orange-400 rounded-2xl animate-bounce-subtle">
                <Lightbulb size={24} className="fill-current" />
              </div>
              <h4 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
                Micro-Mission
              </h4>
              <p className="text-lg md:text-xl font-medium text-slate-200 mb-6">
                {data?.text}
              </p>
            </>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={getIdea}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wide transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;