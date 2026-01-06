
export type HabitStatus = 'done' | 'missed' | 'future';

export interface HabitDefinition {
  id: string;
  name: string;
  icon?: string;
}

export interface HabitData {
  [habitId: string]: {
    [dateString: string]: boolean;
  };
}

export interface HarvestedPlant {
  habitId: string;
  timestamp: number;
}

export interface ChartDataItem {
  date: string;
  completed: number;
  percentage: number;
}
