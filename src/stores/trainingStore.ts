import { create } from 'zustand';
import type { TrainingDay, RunningRecord, Assessment } from '../types';

// ── Training Types Config ──
export const TRAINING_TYPES: Record<string, { icon: string; label: string; color: string }> = {
  'easy-run': { icon: 'smile',        label: '轻松跑',   color: '#4CAF50' },
  'rest':     { icon: 'coffee',       label: '休息',     color: '#9E9E9E' },
  'interval': { icon: 'thunderbolt',  label: '间歇跑',   color: '#FFA726' },
  'tempo':    { icon: 'dashboard',    label: '节奏跑',   color: '#42A5F5' },
  'lsd':      { icon: 'compass',      label: 'LSD长距离', color: '#7E57C2' },
  'recovery': { icon: 'heart',        label: '恢复日',   color: '#EC407A' },
};

export const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// ── Default Assessment ──
export const DEFAULT_ASSESSMENT: Assessment = {
  endurance: 72, speed: 58, strength: 45, recovery: 80, mileage: 65,
  summary: '你的有氧基础扎实，耐力水平良好。速度和力量有较大提升空间。建议以轻松跑和节奏跑为主，逐步加入间歇训练。',
};

// ── Default Week Schedule ──
export const DEFAULT_WEEK: TrainingDay[] = [
  { day:0, type:'easy-run', warmup:'慢跑 10min + 动态拉伸 5min', main:'配速 6\'00"-6\'30"/km · 距离 8km · 心率 Z2 (130-145)', cooldown:'慢跑 5min + 静态拉伸 10min', rpe:4, duration:55, distance:8, completed:true },
  { day:1, type:'rest',     warmup:'', main:'完全休息，可做轻度拉伸', cooldown:'', rpe:0, duration:0, distance:0, completed:true },
  { day:2, type:'interval', warmup:'慢跑 15min + 动态拉伸 + strides×4', main:'400m×8组 · 配速 4\'00"/km · 组间慢跑200m · 心率 Z4', cooldown:'慢跑 10min + 静态拉伸 10min', rpe:8, duration:45, distance:6, completed:true },
  { day:3, type:'tempo',    warmup:'慢跑 12min + 动态拉伸', main:'配速 5\'15"-5\'30"/km · 距离 6km · 心率 Z3 (155-168)', cooldown:'慢跑 8min + 静态拉伸', rpe:6, duration:40, distance:6, completed:false },
  { day:4, type:'rest',     warmup:'', main:'完全休息', cooldown:'', rpe:0, duration:0, distance:0, completed:false },
  { day:5, type:'lsd',      warmup:'慢跑 10min + 动态拉伸', main:'配速 6\'15"-6\'45"/km · 距离 16km · 心率 Z2 (130-145)', cooldown:'慢跑 10min + 泡沫轴放松 15min', rpe:5, duration:110, distance:16, completed:false },
  { day:6, type:'recovery', warmup:'', main:'30min 慢跑 + 15min 泡沫轴 + 拉伸', cooldown:'', rpe:2, duration:45, distance:3, completed:false },
];

// ── Default Records ──
export const DEFAULT_RECORDS: RunningRecord[] = [
  { date:'7/22', day:'周一', type:'easy-run', distance:8.2, pace:'6\'12"', duration:51, hr:148, rpe:4, status:'done', statusLabel:'按计划完成', statusColor:'green' },
  { date:'7/23', day:'周二', type:'rest',     distance:0,   pace:'-',      duration:0,  hr:0,   rpe:0, status:'done', statusLabel:'按计划完成', statusColor:'green' },
  { date:'7/24', day:'周三', type:'interval', distance:5.8, pace:'4\'15"', duration:42, hr:165, rpe:8, status:'warn', statusLabel:'配速偏快',   statusColor:'yellow' },
  { date:'7/25', day:'周四', type:'tempo',    distance:6.1, pace:'5\'20"', duration:43, hr:158, rpe:6, status:'done', statusLabel:'按计划完成', statusColor:'green' },
  { date:'7/26', day:'周五', type:'rest',     distance:0,   pace:'-',      duration:0,  hr:0,   rpe:0, status:'done', statusLabel:'按计划完成', statusColor:'green' },
  { date:'7/27', day:'周六', type:'lsd',      distance:0,   pace:'-',      duration:0,  hr:0,   rpe:0, status:'miss', statusLabel:'未完成',     statusColor:'red' },
  { date:'7/28', day:'周日', type:'recovery', distance:3.1, pace:'7\'30"', duration:48, hr:122, rpe:2, status:'done', statusLabel:'按计划完成', statusColor:'green' },
];

export const WEEKLY_CHART = [8.2, 0, 5.8, 6.1, 0, 0, 3.1];
export const PACE_TREND = ['6\'30"', '6\'15"', '6\'08"', '5\'56"'];

// ── Store ──
interface TrainingState {
  hasData: boolean;
  setHasData: (v: boolean) => void;

  assessment: Assessment;
  currentWeek: number;
  weeks: TrainingDay[][];
  records: RunningRecord[];

  toggleDayComplete: (weekIdx: number, dayIdx: number) => void;
  setCurrentWeek: (w: number) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  hasData: false,
  setHasData: (v) => set({ hasData: v }),

  assessment: DEFAULT_ASSESSMENT,
  currentWeek: 3,
  weeks: Array.from({ length: 12 }, (_, w) =>
    DEFAULT_WEEK.map(d => ({ ...d, completed: w < 3 ? true : d.completed }))
  ),

  records: DEFAULT_RECORDS,

  toggleDayComplete: (weekIdx, dayIdx) => set(state => {
    const weeks = [...state.weeks];
    weeks[weekIdx] = [...weeks[weekIdx]];
    weeks[weekIdx][dayIdx] = { ...weeks[weekIdx][dayIdx], completed: !weeks[weekIdx][dayIdx].completed };
    return { weeks };
  }),

  setCurrentWeek: (w) => set({ currentWeek: w }),
}));
