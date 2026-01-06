
import React from 'react';
import { HABITS } from '../constants';
import { getCurrentDateString } from '../utils';

interface HeaderProps {
  habitData: Record<string, Record<string, boolean>>;
}

const Header: React.FC<HeaderProps> = ({ habitData }) => {
  const today = getCurrentDateString();
  const completedToday = HABITS.filter(h => habitData[h.id]?.[today]).length;
  const progressPercent = Math.round((completedToday / HABITS.length) * 100);

  return (
    <header className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-xs font-bold tracking-[0.3em] text-green-500 uppercase">System Online</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">
            Zenith<span className="text-green-500">Flow</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium tracking-wide">Jan 06, 2026 • Performance Status: Optimal</p>
        </div>
        
        <div className="glass px-8 py-5 rounded-2xl flex flex-col gap-3 min-w-[320px] border-l-4 border-l-green-500">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Today's Achievement</span>
            <span className="text-2xl font-black text-white font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-[2px]">
            <div 
              className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all duration-1000 ease-out neon-green-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <span>{completedToday} Habits Crushed</span>
            <span>Target: {HABITS.length}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
