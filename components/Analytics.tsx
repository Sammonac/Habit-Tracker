
import React, { useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { HABITS, ANALYTICS_DAYS } from '../constants';
import { getLocalDateString, getDisplayDate } from '../utils';

interface AnalyticsProps {
  habitData: Record<string, Record<string, boolean>>;
}

const Analytics: React.FC<AnalyticsProps> = ({ habitData }) => {
  const chartData = useMemo(() => {
    const data = [];
    for (let i = ANALYTICS_DAYS - 1; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      const completed = HABITS.filter(h => habitData[h.id]?.[dateStr]).length;
      data.push({
        date: getDisplayDate(dateStr),
        completed,
      });
    }
    return data;
  }, [habitData]);

  return (
    <div className="glass p-8 rounded-3xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Performance Pulse</h2>
          <p className="text-gray-500 text-sm">Momentum trajectory over the last 14 cycles</p>
        </div>
        <div className="px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
          Active Monitoring
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              domain={[0, 13]}
              ticks={[0, 4, 8, 13]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
              labelStyle={{ color: '#666', marginBottom: '4px' }}
              cursor={{ stroke: 'rgba(34, 197, 94, 0.2)', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#22c55e" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPulse)" 
              animationDuration={2000}
              activeDot={{ r: 6, fill: '#22c55e', stroke: '#000', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
