import type { Assessment, PlanPreferences, TrainingDay } from '../types';

// Configuration — use your own API proxy endpoint
const API_BASE = import.meta.env.VITE_LLM_PROXY || '';

export interface LLMConfig {
  apiKey?: string;
  model?: string;
}

const defaultConfig: LLMConfig = {
  model: 'gpt-4o',
};

// ── OCR: Screenshot → Structured Data ──
export async function recognizeRunningScreenshot(
  imageBase64: string,
  config: LLMConfig = {}
): Promise<{
  recent5k: string; avgPace: string; avgHeartRate: string;
  monthlyMileage: string; runTypes: string[]; runningYears: string;
}> {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model || defaultConfig.model,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: SYSTEM_PROMPTS.ocr },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      }],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── Assessment: History → Ability Profile ──
export async function assessRunnerAbility(
  records: { date: string; type: string; distance: number; pace: string; hr: number }[],
  config: LLMConfig = {}
): Promise<Assessment> {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model || defaultConfig.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.assess },
        { role: 'user', content: JSON.stringify(records) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── Plan Generation: Profile + Preferences → Training Plan ──
export async function generateTrainingPlan(
  assessment: Assessment,
  preferences: PlanPreferences,
  mode: string,
  goalDistance: string,
  goalTime: string,
  config: LLMConfig = {}
): Promise<TrainingDay[][]> {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model || defaultConfig.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.plan },
        { role: 'user', content: JSON.stringify({ assessment, preferences, mode, goalDistance, goalTime }) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    }),
  });
  const data = await res.json();
  const result = JSON.parse(data.choices[0].message.content);
  return result.weeks;
}

// ── Adjust Plan: Actual vs Planned → Adjusted Plan ──
export async function adjustTrainingPlan(
  originalPlan: TrainingDay[],
  actualRecords: { day: number; completed: boolean; actualDistance?: number; actualPace?: string; rpe?: number }[],
  config: LLMConfig = {}
): Promise<{ adjustedWeek: TrainingDay[]; advice: string }> {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model || defaultConfig.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.adjust },
        { role: 'user', content: JSON.stringify({ originalPlan, actualRecords }) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── System Prompts ──
const SYSTEM_PROMPTS = {
  ocr: `你是一个跑步数据识别助手。从跑步APP截图中提取以下信息，返回JSON：
{ "recent5k": "最近5公里成绩", "avgPace": "平均配速", "avgHeartRate": "平均心率", "monthlyMileage": "月跑量(km)", "runTypes": ["偏好跑步类型"], "runningYears": "跑步年限" }`,

  assess: `你是一个跑步教练。根据用户的历史跑步数据，评估以下5个维度（0-100分），返回JSON：
{ "endurance": 数字, "speed": 数字, "strength": 数字, "recovery": 数字, "mileage": 数字, "summary": "200字以内综合分析" }`,

  plan: `你是一个专业跑步教练。根据用户能力评估和偏好配置，生成结构化训练计划。返回JSON格式：
{ "weeks": [[每周7天的训练数据]] }
每天的训练数据格式：
{ "day": 0-6, "type": "easy-run|rest|interval|tempo|lsd|recovery", "warmup": "热身内容", "main": "主课内容", "cooldown": "放松内容", "rpe": 1-10, "duration": 分钟数, "distance": 公里数, "completed": false }`,

  adjust: `你是一个跑步教练。根据原计划和实际完成情况，调整本周剩余训练。返回JSON：
{ "adjustedWeek": [调整后的7天训练数据], "advice": "200字以内调整建议" }`,
};
