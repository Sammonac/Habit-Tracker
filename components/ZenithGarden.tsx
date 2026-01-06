
import React from 'react';
import { HabitDefinition, HabitData } from '../types';

interface ZenithGardenProps {
  habits: HabitDefinition[];
  habitData: HabitData;
  getStreak: (habitId: string) => number;
}

const ZenithGarden: React.FC<ZenithGardenProps> = ({ habits, habitData, getStreak }) => {
  const ABSTINENCE_IDS = ['p', 'w', 'd', 'z'];

  const getGrowthStage = (streak: number) => {
    if (streak >= 9) return 4;
    if (streak >= 6) return 3;
    if (streak >= 3) return 2;
    return 1;
  };

  const getStageLabel = (stage: number, isAbstinence: boolean) => {
    if (isAbstinence) {
      switch(stage) {
        case 4: return "Apex Guardian";
        case 3: return "Hatchling";
        case 2: return "Egg (Pulse)";
        default: return "Dormant";
      }
    }
    switch(stage) {
      case 4: return "Ready to Harvest";
      case 3: return "Budding";
      case 2: return "Sprouting";
      default: return "Seedling";
    }
  };

  const ZenMonIcon = ({ habitId, stage }: { habitId: string, stage: number }) => {
    const config: Record<string, { color: string, path: string }> = {
      p: { color: "text-purple-500", path: "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" }, // Shadow
      w: { color: "text-blue-300", path: "M17.5 19c.4 0 .7-.1 1-.3 1.3-.7 1.3-2.7 0-3.4-.3-.2-.6-.3-1-.3h-1.3c-.1-1.3-1.2-2.3-2.5-2.3-.3 0-.6 0-.8.1-.5-1.5-2-2.5-3.7-2.5-1.7 0-3.2 1-3.7 2.5-.2-.1-.5-.1-.8-.1-1.3 0-2.4 1-2.5 2.3h-1.3c-.4 0-.7.1-1 .3-1.3.7-1.3 2.7 0 3.4.3.2.6.3 1 .3h17.5z" }, // Cloud/Smoke
      d: { color: "text-orange-500", path: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14-1.5-3.5-1.5-5 0 2.15 2 4.15 2 6.15.02.1.03.2.03.35A3.5 3.5 0 0114 14.5a3.5 3.5 0 01-3.5 3.5 3.5 3.5 0 01-3.5-3.5z" }, // Fire
      z: { color: "text-cyan-400", path: "M20 7h-9m0 0l-2-2m2 2l-2 2M4 17h9m0 0l2-2m-2 2l2 2" }, // Digital
    };

    const { color, path } = config[habitId] || { color: "text-gray-500", path: "" };

    if (stage === 1) return <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />;
    
    return (
      <div className={`relative ${stage === 4 ? 'animate-bounce' : ''}`}>
        {stage >= 3 && <div className={`absolute inset-0 ${color} blur-2xl opacity-20`} />}
        <svg className={`w-16 h-16 ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {stage === 2 && <circle cx="12" cy="12" r="8" strokeDasharray="4 4" />}
          {stage >= 3 && <path strokeLinecap="round" strokeLinejoin="round" d={path} />}
        </svg>
      </div>
    );
  };

  const PlantIcon = ({ stage, index }: { stage: number, index: number }) => {
    const colors = ["text-green-600", "text-blue-500", "text-emerald-400", "text-lime-500", "text-teal-500", "text-green-400", "text-sky-500", "text-indigo-400", "text-green-500"];
    const color = colors[index % colors.length];

    if (stage === 1) return <svg className={`w-12 h-12 ${color} opacity-30`} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="18" r="2" /></svg>;
    if (stage === 2) return <svg className={`w-12 h-12 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V12" /><path d="M12 12c-2.5 0-4.5-2-4.5-4.5S9.5 3 12 3s4.5 2 4.5 4.5-2 4.5-4.5 4.5z" /></svg>;
    if (stage === 3) return <svg className={`w-16 h-16 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V10" /><path d="M12 10c0-3.3 2.7-6 6-6M12 10c0-3.3-2.7-6-6-6" /><path d="M12 10c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5z" /></svg>;
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-2xl animate-pulse rounded-full" />
        <svg className={`w-20 h-20 ${color} relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22V12" /><circle cx="12" cy="8" r="4" /><circle cx="12" cy="3" r="2" /><circle cx="12" cy="13" r="2" /><circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" />
        </svg>
      </div>
    );
  };

  return (
    <div className="glass p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">The Nursery</h2>
        <p className="text-gray-500 text-sm font-medium">9-day streaks evolve Guardians or harvest Plants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {habits.map((habit, idx) => {
          const isAbstinence = ABSTINENCE_IDS.includes(habit.id.toLowerCase());
          const streak = getStreak(habit.id);
          const stage = getGrowthStage(streak);
          const progress = (streak / 9) * 100;

          return (
            <div 
              key={habit.id} 
              className={`relative flex flex-col items-center justify-center p-8 glass rounded-3xl border-white/5 transition-all hover:border-white/10 group overflow-hidden ${isAbstinence ? 'ring-1 ring-white/5 bg-gradient-to-b from-transparent to-white/[0.02]' : ''}`}
            >
              <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
                <div className={`h-full transition-all duration-1000 ${isAbstinence ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-green-500'}`} style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              
              <div className="mb-6 flex items-center justify-center h-24">
                {isAbstinence ? <ZenMonIcon habitId={habit.id.toLowerCase()} stage={stage} /> : <PlantIcon stage={stage} index={idx} />}
              </div>
              
              <div className="text-center">
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-green-400 transition-colors uppercase tracking-widest">
                  {isAbstinence ? `Zen-Mon: ${habit.name}` : habit.name}
                </h4>
                <div className="flex items-center gap-2 justify-center">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${stage === 4 ? 'bg-white text-black border-transparent' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                    {getStageLabel(stage, isAbstinence)}
                  </span>
                  <span className={`text-[10px] font-mono ${isAbstinence ? 'text-indigo-400' : 'text-orange-500'}`}>{streak}/9</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZenithGarden;
