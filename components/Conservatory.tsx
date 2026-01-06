
import React from 'react';
import { HabitDefinition, HarvestedPlant } from '../types';

interface ConservatoryProps {
  habits: HabitDefinition[];
  archive: HarvestedPlant[];
}

const Conservatory: React.FC<ConservatoryProps> = ({ habits, archive }) => {
  const ABSTINENCE_IDS = ['p', 'w', 'd', 'z'];
  const dailyEssentials = habits.filter(h => !ABSTINENCE_IDS.includes(h.id.toLowerCase()));
  const abstinenceHabits = habits.filter(h => ABSTINENCE_IDS.includes(h.id.toLowerCase()));

  const ZenMonGuardian = ({ habitId }: { habitId: string }) => {
    const config: Record<string, { color: string, path: string }> = {
      p: { color: "text-purple-400", path: "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" },
      w: { color: "text-blue-200", path: "M17.5 19c.4 0 .7-.1 1-.3 1.3-.7 1.3-2.7 0-3.4-.3-.2-.6-.3-1-.3h-1.3c-.1-1.3-1.2-2.3-2.5-2.3-.3 0-.6 0-.8.1-.5-1.5-2-2.5-3.7-2.5-1.7 0-3.2 1-3.7 2.5-.2-.1-.5-.1-.8-.1-1.3 0-2.4 1-2.5 2.3h-1.3c-.4 0-.7.1-1 .3-1.3.7-1.3 2.7 0 3.4.3.2.6.3 1 .3h17.5z" },
      d: { color: "text-orange-400", path: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14-1.5-3.5-1.5-5 0 2.15 2 4.15 2 6.15.02.1.03.2.03.35A3.5 3.5 0 0114 14.5a3.5 3.5 0 01-3.5 3.5 3.5 3.5 0 01-3.5-3.5z" },
      z: { color: "text-cyan-400", path: "M20 7h-9m0 0l-2-2m2 2l-2 2M4 17h9m0 0l2-2m-2 2l2 2" },
    };
    const { color, path } = config[habitId.toLowerCase()] || { color: "text-gray-400", path: "" };
    return (
      <svg className={`w-10 h-10 ${color} drop-shadow-[0_0_12px_currentColor]`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    );
  };

  const StaticPlant = ({ index }: { index: number }) => {
    const colors = ["text-green-400", "text-blue-400", "text-emerald-400", "text-lime-400", "text-teal-400", "text-sky-400", "text-indigo-400", "text-green-300", "text-cyan-400"];
    const color = colors[index % colors.length];
    return (
      <svg className={`w-10 h-10 ${color} drop-shadow-[0_0_8px_currentColor]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12" /><circle cx="12" cy="8" r="4" /><circle cx="12" cy="3" r="2" /><circle cx="12" cy="13" r="2" /><circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" />
      </svg>
    );
  };

  return (
    <div className="glass p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">The Conservatory</h2>
          <p className="text-gray-500 text-sm font-medium">Permanent collection of behavioral mastery.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Harvest</div>
          <div className="text-2xl font-black text-white font-mono">{archive.length}</div>
        </div>
      </div>

      {/* Apex Row for Abstinence Creatures */}
      <div className="mb-12">
        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
          Apex Row: Zen-Mon Guardians <div className="h-[1px] flex-1 bg-indigo-500/20" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {abstinenceHabits.map((habit) => {
            const creatures = archive.filter(p => p.habitId.toLowerCase() === habit.id.toLowerCase());
            return (
              <div key={habit.id} className="glass rounded-3xl p-6 min-h-[140px] border-indigo-500/10 bg-indigo-500/[0.02] flex flex-col items-center justify-start group">
                <h4 className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">{habit.name}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {creatures.length > 0 ? (
                    creatures.map((c, i) => <div key={i}><ZenMonGuardian habitId={habit.id} /></div>)
                  ) : (
                    <div className="opacity-10 mt-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid for Daily Essentials Plants */}
      <div>
        <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
          Daily Essentials: Harvested Flora <div className="h-[1px] flex-1 bg-green-500/20" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyEssentials.map((habit, idx) => {
            const plants = archive.filter(p => p.habitId === habit.id);
            return (
              <div key={habit.id} className="glass rounded-3xl p-6 min-h-[160px] border-white/5 flex flex-col items-center justify-start group">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 group-hover:text-white transition-colors">{habit.name}</h4>
                <div className="flex flex-wrap justify-center gap-2 max-w-full">
                  {plants.length > 0 ? (
                    plants.map((p, i) => <div key={i}><StaticPlant index={idx} /></div>)
                  ) : (
                    <div className="opacity-10 mt-4"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Conservatory;
