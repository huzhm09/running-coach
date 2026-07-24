import React from 'react';
import { Button } from 'antd-mobile';
import { WEEK_SCHEDULE, TRAINING_TYPES, DAY_LABELS, DEFAULT_ASSESSMENT } from '../stores/trainingStore';
import { SmileOutlined, CoffeeOutlined, ThunderboltOutlined, DashboardOutlined, CompassOutlined, HeartOutlined, UploadOutlined, AimOutlined, CheckOutlined, CheckCircleOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import RadarChart from '../components/RadarChart';

const C = {
  primary: '#FF6B35', primaryHover: '#E85A2A', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  border: '#F0E6D8', borderLight: '#F8F2EC',
  surface: '#FFFFFF', green: '#4CAF50',
  warmBg: '#FFF9F5',
};

const iconNode: Record<string, React.ReactNode> = {
  smile: <SmileOutlined />, coffee: <CoffeeOutlined />, thunderbolt: <ThunderboltOutlined />,
  dashboard: <DashboardOutlined />, compass: <CompassOutlined />, heart: <HeartOutlined />,
};

const S = {
  page: { padding: 16, paddingBottom: 8 } as React.CSSProperties,
  card: { background: C.surface, borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(60,34,24,0.04), 0 2px 8px rgba(60,34,24,0.06)', border: '0.5px solid rgba(0,0,0,0.04)' } as React.CSSProperties,
  btnPrimary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 8px ${C.primary}40`, fontFamily: 'inherit', width: '100%' } as React.CSSProperties,
  btnOutline: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnGhost: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'transparent', color: C.textSec, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
};

interface Props {
  hasData: boolean;
  setHasData: (v: boolean) => void;
  onStartOnboarding: (step?: number) => void;
  onSwitchTab: (tab: string) => void;
}

const HomePage: React.FC<Props> = ({ hasData, setHasData, onStartOnboarding, onSwitchTab }) => {

  // ── Empty State ──
  if (!hasData) {
    return (
      <div style={{ ...S.page, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:24 }}>
        <AimOutlined style={{ fontSize:64, color:C.primary, opacity:0.6 }} />
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.text, marginBottom:8, margin:0 }}>让 AI 了解你的跑步能力</h2>
          <p style={{ fontSize:14, color:C.textSec, lineHeight:1.6, margin:0 }}>上传你的跑步数据，获得专属训练计划</p>
        </div>
        <div style={{ ...S.card, background:C.primaryLight, width:'100%', textAlign:'left' }}>
          <p style={{ fontSize:14, color:C.text, lineHeight:1.6, marginBottom:16, margin:0 }}>
            AI 将综合分析你的历史跑步数据，评估各项能力指标，生成适合你当前水平的个性化训练计划。
          </p>
          <Button color="primary" fill="solid" block size="large"
            style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border:'none', borderRadius:12, fontWeight:600, marginTop:16 }}
            onClick={() => onStartOnboarding(1)}>
            <UploadOutlined style={{ marginRight:6 }} /> 上传跑步数据
          </Button>
          <div style={{ textAlign:'center', marginTop:8 }}>
            <span style={{ ...S.btnGhost, width:'100%', display:'inline-block', textAlign:'center', cursor:'pointer' }}
              onClick={() => setHasData(true)}>跳过，先看看 App</span>
          </div>
        </div>
        <span style={{ fontSize:11, color:C.textTer, cursor:'pointer' }} onClick={() => setHasData(true)}>模拟：已有数据 →</span>
      </div>
    );
  }

  // ── Has Data State ──
  const todayIdx = 3; // Thursday
  const today = WEEK_SCHEDULE[todayIdx];
  const todayType = TRAINING_TYPES[today.type];
  const todayLabel = DAY_LABELS[todayIdx];

  const purposeText: Record<string, string> = {
    'easy-run': '保持有氧基础，促进恢复，为高强度训练储备体能',
    'interval': '提升最大摄氧量和速度耐力，突破配速瓶颈',
    'tempo': '提高乳酸阈值，让你在比赛配速下更持久',
    'lsd': '建立有氧耐力基础，提升脂肪供能效率',
    'recovery': '主动恢复，促进血液循环，加速肌肉修复',
    'rest': '让身体充分休息，迎接接下来的训练挑战',
  };

  return (
    <div style={S.page}>
      {/* Toggle */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
        <span style={{ ...S.btnGhost, fontSize:11, color:C.textTer }} onClick={() => setHasData(false)}>← 清空数据</span>
      </div>

      {/* ★ TODAY'S TRAINING — full detail inline */}
      <div style={{ ...S.card, marginBottom:12, padding:0, overflow:'hidden', borderColor:C.primaryLight, borderWidth:1.5 }}>
        {/* Header banner */}
        <div style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, color:'#fff', padding:'14px 16px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-15, top:-15, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:32 }}>{iconNode[todayType.icon] || <AimOutlined style={{ fontSize:32, color:'#fff' }} />}</span>
              <div>
                <div style={{ fontSize:18, fontWeight:800 }}>{todayType.label}</div>
                <div style={{ fontSize:12, opacity:0.85 }}>今日训练 · {todayLabel}</div>
              </div>
            </div>
            <span style={{ fontSize:11, padding:'4px 12px', borderRadius:10, background:'rgba(255,255,255,0.2)', fontWeight:600 }}>
              {today.completed ? '已完成' : '待完成'}
            </span>
          </div>
          {today.distance > 0 && (
            <div style={{ position:'relative', zIndex:1, display:'flex', gap:20, marginTop:10 }}>
              <div><div style={{ fontSize:24, fontWeight:800 }}>{today.distance}</div><div style={{ fontSize:11, opacity:0.8 }}>公里</div></div>
              <div><div style={{ fontSize:24, fontWeight:800 }}>{today.duration}</div><div style={{ fontSize:11, opacity:0.8 }}>分钟</div></div>
              <div><div style={{ fontSize:24, fontWeight:800 }}>{today.rpe}/10</div><div style={{ fontSize:11, opacity:0.8 }}>RPE</div></div>
            </div>
          )}
        </div>

        {/* Detail body */}
        <div style={{ padding:'14px 16px', background:'#FFF9F5' }}>
          {/* Purpose */}
          <div style={{ textAlign:'center', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textTer, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>训练目标</div>
            <p style={{ fontSize:12, color:C.textSec, lineHeight:1.6, margin:0 }}>{purposeText[today.type] || '完成今日训练计划'}</p>
          </div>

          {/* Timeline steps */}
          <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:14 }}>
            {today.warmup ? (
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:24, flexShrink:0 }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:'#FFF3E0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <FireOutlined style={{ fontSize:12, color:'#FF9800' }} />
                  </div>
                  <div style={{ width:1.5, flex:1, background:C.borderLight, minHeight:12 }} />
                </div>
                <div style={{ flex:1, paddingBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>热身</div>
                  <div style={{ fontSize:11, color:C.textSec, lineHeight:1.5 }}>{today.warmup}</div>
                </div>
              </div>
            ) : null}
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <ThunderboltOutlined style={{ fontSize:12, color:C.primary }} />
              </div>
              <div style={{ flex:1, paddingBottom: today.cooldown ? 10 : 0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:6 }}>主课</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.7, fontWeight:500, padding:'8px 12px', background:C.surface, borderRadius:8, border:`0.5px solid ${C.borderLight}` }}>{today.main}</div>
              </div>
            </div>
            {today.cooldown ? (
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#E8F5E9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <DashboardOutlined style={{ fontSize:12, color:'#4CAF50' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>放松</div>
                  <div style={{ fontSize:11, color:C.textSec, lineHeight:1.5 }}>{today.cooldown}</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* HR Zones + Feel */}
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <div style={{ flex:1, background:C.surface, borderRadius:8, padding:10, border:`0.5px solid ${C.borderLight}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.textSec, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>心率区间</div>
              <div style={{ display:'flex', height:6, borderRadius:3, overflow:'hidden', gap:1, marginBottom:4 }}>
                <div style={{ flex:1, background:'#E3F2FD' }} />
                <div style={{ flex:1, background:'#BBDEFB' }} />
                <div style={{ flex:1, background: today.type==='tempo'||today.type==='interval'?'#64B5F6':'#E0E0E0', borderRadius:1 }} />
                <div style={{ flex:1, background: today.type==='interval'?'#FFA726':'#E0E0E0' }} />
                <div style={{ flex:0.5, background:'#E0E0E0' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:8, color:C.textTer }}>
                <span>Z1</span><span>Z2</span><span>Z3</span><span>Z4</span><span>Z5</span>
              </div>
            </div>
            <div style={{ flex:1, background:C.surface, borderRadius:8, padding:10, border:`0.5px solid ${C.borderLight}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.textSec, marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>体感</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <DashboardOutlined style={{ fontSize:18, color:C.primary }} />
                <div style={{ fontSize:11, color:C.text, lineHeight:1.4 }}>
                  {today.rpe <= 3 ? '非常轻松' : today.rpe <= 5 ? '舒适努力' : today.rpe <= 7 ? '有些吃力' : '全力以赴'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:8 }}>
            {today.completed ? (
              <Button color="success" fill="solid" block style={{ flex:1, borderRadius:12, fontWeight:600 }}>
                <CheckOutlined style={{ marginRight:6 }} /> 训练已完成
              </Button>
            ) : (
              <Button color="primary" fill="solid" block style={{ flex:1, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border:'none', borderRadius:12, fontWeight:600 }}>
                <CheckCircleOutlined style={{ marginRight:6 }} /> 开始训练
              </Button>
            )}
            <Button fill="outline" style={{ ...S.btnOutline, borderColor:C.border, color:C.textSec, flex:'none' }}
              onClick={() => onSwitchTab('plan')}>
              查看周计划 →
            </Button>
          </div>
        </div>
      </div>

      {/* Week overview */}
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontSize:14, fontWeight:600, color:C.text }}>本周概览</span>
          <span style={{ fontSize:13, color:C.textSec }}>已完成 2/4 次</span>
        </div>
        <div style={{ height:6, background:C.borderLight, borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:'50%', background:`linear-gradient(90deg,${C.primary},${C.primaryHover})`, borderRadius:3 }} />
        </div>
        <div style={{ display:'flex', gap:24, marginTop:10, fontSize:13, color:C.textSec }}>
          <span>AimOutlined 累计 18km</span>
          <span>DashboardOutlined 配速 6'15"</span>
        </div>
      </div>

      {/* Radar + Coach side by side */}
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <div style={{ ...S.card, flex:1, textAlign:'center', padding:12 }}>
          <h3 style={{ fontSize:12, fontWeight:700, color:C.text, margin:'0 0 8px' }}>能力画像</h3>
          <RadarChart data={DEFAULT_ASSESSMENT} size={130} />
        </div>
        <div style={{ ...S.card, flex:1, background:C.primaryLight, padding:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <StarOutlined style={{ fontSize:16, color:C.primary }} />
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>教练建议</span>
          </div>
          <p style={{ fontSize:11, color:C.text, lineHeight:1.6, margin:0 }}>耐力不错！保持轻松跑节奏，周五间歇可以加一组。别忘拉伸~</p>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10 }}>
        <Button fill="outline" style={{ flex:1, borderColor:C.primary, color:C.primary, borderRadius:12, fontWeight:600 }}
          onClick={() => onStartOnboarding(1)}>
          <UploadOutlined style={{ marginRight:6 }} /> 上传新数据
        </Button>
        <Button fill="outline" style={{ flex:1, borderColor:C.border, color:C.textSec, borderRadius:12, fontWeight:600 }}
          onClick={() => onStartOnboarding(5)}>
          <DashboardOutlined style={{ marginRight:6 }} /> 调整偏好
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
