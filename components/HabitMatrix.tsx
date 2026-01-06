
import React from 'react';
import { HABITS, DAYS_TO_SHOW } from '../constants';
import { getLocalDateString, calculateStreak, getCurrentDateString } from '../utils';

interface HabitMatrixProps {
  habitData: Record<string, Record<string, boolean>>;
  onToggle: (habitId: string, date: string) => void;
}

const HabitMatrix: React.FC<HabitMatrixProps> = ({ habitData, onToggle }) => {
  const dates = Array.from({ length: DAYS_TO_SHOW }, (_, i) => getLocalDateString(i)).reverse();
  const today = getCurrentDateString();

  return (
    <div className="glass p-8 rounded-3xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">The Master Matrix</h2>
        <p className="text-gray-500 text-sm">Interactive 30-day behavioral heatmap.</p>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-6">
        <div className="min-w-[1000px] flex flex-col gap-3">
          {HABITS.map((habit) => {
            const streak = calculateStreak(habit.id, habitData);
            return (
              <div key={habit.id} className="flex items-center group">
                <div className="w-48 shrink-0 flex items-center justify-between pr-6 border-r border-white/5">
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors truncate">
                    {habit.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded italic">
                    {streak}🔥
                  </span>
                </div>
                
                <div className="flex gap-1.5 pl-6">
                  {dates.map((date) => {
                    const isDone = habitData[habit.id]?.[date];
                    const isToday = date === today;
                    const isFuture = date > today;
                    
                    let bgClass = "bg-[#121212] border border-white/5"; // Deep Charcoal for missed
                    if (isDone) bgClass = "bg-green-500 neon-green-glow border-transparent scale-[1.05]"; // Neon Green for success
                    if (isFuture) bgClass = "bg-transparent border border-white/5 opacity-20 cursor-default";
                    
                    return (
                      <button
                        key={date}
                        disabled={isFuture}
                        onClick={() => onToggle(habit.id, date)}
                        className={`w-6 h-6 rounded-md transition-all duration-200 ${bgClass} 
                          ${!isFuture ? 'hover:scale-125 hover:z-20 active:scale-90 cursor-pointer' : ''} 
                          ${isToday && !isDone ? 'ring-1 ring-green-500/50 ring-offset-2 ring-offset-[#020202]' : ''}`}
                        title={`${habit.name}: ${date}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-[9px] text-gray-600 font-black tracking-widest uppercase">
        <span>&larr; 30 Days Ago</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-green-500" /> Success</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#121212]" /> Missed</span>
        </div>
        <span>Today &rarr;</span>
      </div>
    </div>
  );
};

export default HabitMatrix;
