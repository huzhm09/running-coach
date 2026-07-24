import React, { useState, useEffect } from 'react';
import { Button, Popup, Input, Slider } from 'antd-mobile';
import { CameraOutlined, PictureOutlined, LeftOutlined, EditOutlined, StarOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import RadarChart from '../components/RadarChart';
import { DEFAULT_ASSESSMENT, DISTANCE_OPTIONS } from '../stores/trainingStore';

const C = {
  primary: '#FF6B35', primaryHover: '#E85A2A', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  border: '#F0E6D8', borderLight: '#F8F2EC', surface: '#FFFFFF',
};

const DAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];

interface Props {
  step: number;
  setStep: (s: number) => void;
  onClose: () => void;
  onFinish: () => void;
}

const OnboardingFlow: React.FC<Props> = ({ step, setStep, onClose, onFinish }) => {
  const [mode, setMode] = useState<'race' | 'improve'>('race');
  const [goalDist, setGoalDist] = useState('半马');
  const [goalTime, setGoalTime] = useState('2:00:00');
  const [weeklyDays, setWeeklyDays] = useState(4);
  const [intensity, setIntensity] = useState(50);
  const [restDays, setRestDays] = useState<number[]>([1, 3, 5]); // 二四六

  useEffect(() => { if (step === 3) { const t = setTimeout(() => setStep(4), 3000); return () => clearTimeout(t); } }, [step]);

  const nextStep = () => setStep(step + 1);

  const toggleRestDay = (d: number) => {
    setRestDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  if (step === 3) {
    return (
      <Popup visible bodyStyle={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s ease-in-out infinite' }}>
          <RiseOutlined style={{ fontSize: 36, color: C.primary }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>AI 正在分析你的跑步能力...</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary, animation: `dotFade 0.6s ${i * 0.15}s ease-in-out infinite` }} />)}
        </div>
        <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}@keyframes dotFade{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      </Popup>
    );
  }

  return (
    <Popup visible bodyStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '88vh', overflow: 'auto', padding: '24px 16px 32px' }}>
      {step !== 3 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Button fill="none" onClick={step === 1 ? onClose : () => setStep(step - 1)} style={{ color: C.textSec }}>
            {step === 1 ? '取消' : <LeftOutlined />}
          </Button>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(s => <div key={s} style={{ width: step >= s ? 24 : 6, height: 6, borderRadius: 3, background: step >= s ? C.primary : C.border, transition: 'all 0.2s' }} />)}
          </div>
          <div style={{ width: 40 }} />
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: 'center' }}>上传跑步数据</h2>
          <p style={{ fontSize: 13, color: C.textSec, textAlign: 'center', marginBottom: 24 }}>支持 Keep、咕咚、悦跑圈、Nike Run Club 等主流跑步 App 截图</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <Button fill="outline" block style={{ flex: 1, height: 80, borderRadius: 16, flexDirection: 'column', gap: 8, fontSize: 14, fontWeight: 600, color: C.text, borderColor: C.border }}
              onClick={nextStep}><CameraOutlined style={{ fontSize: 28, color: C.primary }} />拍照</Button>
            <Button fill="outline" block style={{ flex: 1, height: 80, borderRadius: 16, flexDirection: 'column', gap: 8, fontSize: 14, fontWeight: 600, color: C.text, borderColor: C.border }}
              onClick={nextStep}><PictureOutlined style={{ fontSize: 28, color: C.primary }} />从相册选择</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[1, 2].map(n => (
              <div key={n} style={{ flex: 1, aspectRatio: '4/3', borderRadius: 12, background: '#F5F5F5', border: '1.5px dashed #E0E0E0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <PictureOutlined style={{ fontSize: 24, color: C.textTer }} />
                <span style={{ fontSize: 10, color: C.textTer }}>跑步截图{n}.jpg</span>
              </div>
            ))}
          </div>
          <Button color="primary" fill="solid" block size="large" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none', borderRadius: 12, fontWeight: 600 }}
            onClick={nextStep}>开始识别</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: 'center' }}>识别结果确认</h2>
          <p style={{ fontSize: 12, color: C.textSec, textAlign: 'center', marginBottom: 20 }}>请检查并修正识别结果</p>
          {[{ label: '最近5K成绩', value: "25'30\"" }, { label: '平均配速', value: "5'06\" /km" }, { label: '平均心率', value: '152 bpm' }, { label: '月跑量', value: '85 km' }, { label: '跑步年限', value: '1.5 年' }].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: C.textSec, minWidth: 90 }}>{f.label}</label>
              <Input defaultValue={f.value} style={{ flex: 1, borderRadius: 10 } as any} />
              <EditOutlined style={{ fontSize: 14, color: C.textTer }} />
            </div>
          ))}
          <Button color="primary" fill="solid" block size="large" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none', borderRadius: 12, fontWeight: 600, marginTop: 8 }}
            onClick={nextStep}>确认并分析</Button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: 'center' }}>你的能力画像</h2>
          <div style={{ textAlign: 'center', marginBottom: 16 }}><RadarChart data={DEFAULT_ASSESSMENT} size={160} /></div>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, textAlign: 'center', marginBottom: 20 }}>{DEFAULT_ASSESSMENT.summary}</p>
          <Button color="primary" fill="solid" block size="large" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none', borderRadius: 12, fontWeight: 600 }}
            onClick={nextStep}>生成训练计划</Button>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: C.textSec, cursor: 'pointer' }} onClick={onFinish}>稍后再说</div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20, textAlign: 'center' }}>训练偏好设置</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>训练模式</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button fill={mode === 'race' ? 'solid' : 'outline'} block style={{ flex: 1, borderRadius: 12, background: mode === 'race' ? `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})` : undefined, borderColor: C.border, color: mode === 'race' ? '#fff' : C.textSec }}
                  onClick={() => setMode('race')}><TrophyOutlined style={{ marginRight: 4 }} /> 备赛</Button>
                <Button fill={mode === 'improve' ? 'solid' : 'outline'} block style={{ flex: 1, borderRadius: 12, background: mode === 'improve' ? `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})` : undefined, borderColor: C.border, color: mode === 'improve' ? '#fff' : C.textSec }}
                  onClick={() => setMode('improve')}><RiseOutlined style={{ marginRight: 4 }} /> 日常提升</Button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>目标距离</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {DISTANCE_OPTIONS.map(d => (
                  <Button key={d} fill={d === goalDist ? 'solid' : 'outline'} size="small" block
                    style={{ borderRadius: 10, background: d === goalDist ? C.primary : undefined, borderColor: d === goalDist ? C.primary : C.border, color: d === goalDist ? '#fff' : C.textSec }}
                    onClick={() => setGoalDist(d)}>{d}</Button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>期望完赛时间</label>
              <Input value={goalTime} onChange={v => setGoalTime(v)} style={{ textAlign: 'center', fontSize: 15, borderRadius: 10 } as any} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>每周训练天数</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Button size="small" fill="outline" style={{ borderRadius: '50%', width: 32, height: 32, borderColor: C.border }} onClick={() => setWeeklyDays(w => Math.max(1, w - 1))}>−</Button>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{weeklyDays}</span>
                <Button size="small" fill="outline" style={{ borderRadius: '50%', width: 32, height: 32, borderColor: C.border }} onClick={() => setWeeklyDays(w => Math.min(7, w + 1))}>+</Button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>训练强度</label>
              <Slider value={intensity} onChange={v => setIntensity(v as number)} style={{ '--fill-color': C.primary } as React.CSSProperties} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textTer }}><span>保守</span><span>激进</span></div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: 'block' }}>休息日偏好</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {DAY_NAMES.map((d, i) => (
                  <Button key={d} fill={restDays.includes(i) ? 'solid' : 'outline'} size="small" block
                    style={{ borderRadius: 10, background: restDays.includes(i) ? C.primary : undefined, borderColor: restDays.includes(i) ? C.primary : C.border, color: restDays.includes(i) ? '#fff' : C.textSec }}
                    onClick={() => toggleRestDay(i)}>{d}</Button>
                ))}
              </div>
            </div>
          </div>

          <Button color="primary" fill="solid" block size="large" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none', borderRadius: 12, fontWeight: 600, marginTop: 24 }}
            onClick={onFinish}><StarOutlined style={{ marginRight: 6 }} /> 生成我的专属计划</Button>
        </div>
      )}
    </Popup>
  );
};

export default OnboardingFlow;
