// ── Type Definitions ──

export interface UserProfile {
  id?: number;
  email: string;
  nickname: string;
  runningAge: number;
}

export interface TrainingType {
  icon: string;
  label: string;
  color: string;
}

export interface TrainingDay {
  day: number;
  type: string;
  warmup: string;
  main: string;
  cooldown: string;
  rpe: number;
  duration: number;
  distance: number;
  completed: boolean;
}

export interface TrainingPlan {
  id?: number;
  mode: 'race' | 'improve';
  goalDistance: string;
  goalTime: string;
  weeksCount: number;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  preferences: PlanPreferences;
}

export interface PlanPreferences {
  weeklyDays: number;
  maxDuration: number;
  intensity: number;
  restDays: number[];
  injuries: string;
}

export interface RunningRecord {
  id?: number;
  date: string;
  day: string;
  type: string;
  distance: number;
  pace: string;
  duration: number;
  hr: number;
  rpe: number;
  status: 'done' | 'warn' | 'miss';
  statusLabel: string;
  statusColor: 'green' | 'yellow' | 'red';
}

export interface Assessment {
  endurance: number;
  speed: number;
  strength: number;
  recovery: number;
  mileage: number;
  summary: string;
}

export interface HistoryGoal {
  goal: string;
  date: string;
  done: boolean;
}

// LLM API types
export interface OCRResult {
  recent5k: string;
  avgPace: string;
  avgHeartRate: string;
  monthlyMileage: string;
  runTypes: string[];
  runningYears: string;
}

export interface PlanGenRequest {
  assessment: Assessment;
  preferences: PlanPreferences;
  mode: string;
  goalDistance: string;
  goalTime: string;
}

export interface PlanGenResponse {
  weeks: TrainingDay[][];
}
