
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Analytics from './components/Analytics';
import HabitMatrix from './components/HabitMatrix';
import ZenithGarden from './components/ZenithGarden';
import Conservatory from './components/Conservatory';
import { HABITS as DEFAULT_HABITS } from './constants';
import { HabitData, HabitDefinition, HarvestedPlant } from './types';
import { getCurrentDateString, calculateStreak } from './utils';

const STORAGE_DATA_KEY = 'zenithflow_data_v3';
const STORAGE_HABITS_KEY = 'zenithflow_names_v3';
const STORAGE_ARCHIVE_KEY = 'zenith_archive';

const App: React.FC = () => {
  const [view, setView] = useState<'daily' | 'matrix' | 'garden' | 'conservatory'>('daily');
  const [showSettings, setShowSettings] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  
  const [habitData, setHabitData] = useState<HabitData>(() => {
    const saved = localStorage.getItem(STORAGE_DATA_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [habits, setHabits] = useState<HabitDefinition[]>(() => {
    const saved = localStorage.getItem(STORAGE_HABITS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [archive, setArchive] = useState<HarvestedPlant[]>(() => {
    const saved = localStorage.getItem(STORAGE_ARCHIVE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(habitData));
  }, [habitData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ARCHIVE_KEY, JSON.stringify(archive));
  }, [archive]);

  // Streak logic including harvest resets
  const getStreakWithResets = useCallback((habitId: string) => {
    const harvestCount = archive.filter(p => p.habitId.toLowerCase() === habitId.toLowerCase()).length;
    const rawStreak = calculateStreak(habitId, habitData);
    return Math.max(0, rawStreak - (harvestCount * 9));
  }, [habitData, archive]);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setHabitData(prev => {
      const habitRecord = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: { ...habitRecord, [date]: !habitRecord[date] }
      };
    });
  }, []);

  const updateHabitName = (id: string, newName: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h));
  };

  const checkHarvests = useCallback(() => {
    const newHarvests: HarvestedPlant[] = [];
    // Check all habits including the abstinence ones
    habits.forEach(habit => {
      const currentStreak = getStreakWithResets(habit.id);
      if (currentStreak >= 9) {
        newHarvests.push({ habitId: habit.id, timestamp: Date.now() });
      }
    });

    if (newHarvests.length > 0) {
      setArchive(prev => [...prev, ...newHarvests]);
    }
  }, [habits, getStreakWithResets]);

  const handleCompleteDay = () => {
    setIsWatering(true);
    setTimeout(() => {
      setIsWatering(false);
      checkHarvests();
      setView('garden');
    }, 2000);
  };

  const today = getCurrentDateString();

  return (
    <div className="min-h-screen bg-[#020202] text-[#f0f0f0] selection:bg-green-500 selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      {isWatering && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative">
              <svg className="w-24 h-24 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
           </div>
           <h2 className="text-3xl font-black mt-8 tracking-tighter text-blue-400 uppercase italic">Syncing Performance Data...</h2>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8">
          <Header habitData={habitData} />
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl glass transition-all ${showSettings ? 'text-green-500 ring-1 ring-green-500/50' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>

        <Analytics habitData={habitData} />

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 w-fit mx-auto overflow-x-auto max-w-full">
          {[
            { id: 'daily', label: 'Track' },
            { id: 'matrix', label: 'Matrix' },
            { id: 'garden', label: 'Garden' },
            { id: 'conservatory', label: 'Conservatory' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === item.id ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {showSettings ? (
          <div className="glass p-8 rounded-3xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-green-500">Settings:</span> Rename Cycles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map(h => (
                <div key={h.id} className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase px-2">{h.id} Index</label>
                  <input 
                    value={h.name}
                    onChange={(e) => updateHabitName(h.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setShowSettings(false)} className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all">Save Changes</button>
          </div>
        ) : view === 'daily' ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {habits.map(habit => {
              const streak = getStreakWithResets(habit.id);
              const isDoneToday = habitData[habit.id]?.[today];
              return (
                <div key={habit.id} className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${streak > 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                      <span className="text-sm font-black text-orange-500 leading-none">{streak}</span>
                      <span className="text-lg mt-0.5">🔥</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{habit.name}</h4>
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{isDoneToday ? 'Target Cleared' : 'Pending Deployment'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleHabit(habit.id, today)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDoneToday ? 'bg-green-500 text-black neon-green-glow scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {isDoneToday ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    )}
                  </button>
                </div>
              );
            })}
            
            <div className="pt-8">
              <button 
                onClick={handleCompleteDay}
                className="w-full group relative overflow-hidden bg-white text-black py-5 rounded-3xl font-black text-xl tracking-tighter uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Sync Cycle & Advance Garden
                </span>
              </button>
            </div>
          </div>
        ) : view === 'matrix' ? (
          <HabitMatrix habitData={habitData} onToggle={toggleHabit} />
        ) : view === 'garden' ? (
          <ZenithGarden 
            habits={habits} 
            habitData={habitData} 
            getStreak={getStreakWithResets} 
          />
        ) : (
          <Conservatory habits={habits} archive={archive} />
        )}

        <footer className="mt-20 text-center opacity-30 text-[10px] font-bold tracking-[0.4em] uppercase">
          Zenith State: Verified • Jan 06 2026
        </footer>
      </div>
    </div>
  );
};

export default App;
