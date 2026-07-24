import React from 'react';
import { Button, Card } from 'antd-mobile';
import {
  UploadOutlined, CalendarOutlined, ThunderboltOutlined, FireOutlined,
  DashboardOutlined, CheckCircleOutlined, AimOutlined,
  SmileOutlined, CoffeeOutlined, CompassOutlined, HeartOutlined,
} from '@ant-design/icons';
import { useTrainingStore, TRAINING_TYPES, DAY_LABELS, DEFAULT_ASSESSMENT } from '../stores/trainingStore';
import RadarChart from '../components/RadarChart';
import RPEDots from '../components/RPEDots';

const ORANGE = '#FF6B35';
const GREEN = '#4CAF50';

const iconMap: Record<string, React.ReactNode> = {
  smile: <SmileOutlined />,
  coffee: <CoffeeOutlined />,
  thunderbolt: <ThunderboltOutlined />,
  dashboard: <DashboardOutlined />,
  compass: <CompassOutlined />,
  heart: <HeartOutlined />,
};

interface HomePageProps {
  hasData: boolean;
  setHasData: (v: boolean) => void;
  onStartOnboarding: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ hasData, setHasData, onStartOnboarding }) => {

  // ── Empty State ──
  if (!hasData) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 32px', textAlign:'center' }}>
        <UploadOutlined style={{ fontSize:64, color:'#D0D0D0', marginBottom:20 }} />
        <div style={{ fontSize:18, fontWeight:600, color:'#333', marginBottom:8 }}>还没有训练数据</div>
        <div style={{ fontSize:14, color:'#999', marginBottom:32, lineHeight:1.6 }}>
          上传跑步记录截图，AI将为你生成<br />个性化的训练计划
        </div>
        <Button color="primary" fill="solid" size="large" block
          style={{ backgroundColor:ORANGE, borderColor:ORANGE, marginBottom:12 }}
          onClick={onStartOnboarding}>
          <UploadOutlined /> 上传跑步记录
        </Button>
        <div style={{ fontSize:14, color:'#999', cursor:'pointer', textDecoration:'underline' }}
          onClick={() => setHasData(true)}>
          跳过，使用模拟数据
        </div>
      </div>
    );
  }

  // ── Has Data State ──
  const store = useTrainingStore.getState();
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const week = store.weeks[store.currentWeek - 1] || store.weeks[2];
  const todayTraining = week[dayIndex] || week[3];
  const todayType = TRAINING_TYPES[todayTraining.type] || TRAINING_TYPES['easy-run'];
  const todayLabel = DAY_LABELS[dayIndex] || '周四';

  const purposeText: Record<string, string> = {
    'easy-run': '保持有氧基础，促进恢复，为高强度训练储备体能',
    'interval': '提升最大摄氧量和速度耐力，突破配速瓶颈',
    'tempo': '提高乳酸阈值，让你在比赛配速下更持久',
    'lsd': '建立有氧耐力基础，提升脂肪供能效率',
    'recovery': '主动恢复，促进血液循环，加速肌肉修复',
    'rest': '让身体充分休息，迎接接下来的训练挑战',
  };

  const feelText = (rpe: number) =>
    rpe <= 3 ? '非常轻松，可以边跑边聊天' :
    rpe <= 5 ? '舒适努力，呼吸稍快但可持续' :
    rpe <= 7 ? '有些吃力，只能短句交流' : '非常困难，全力以赴';

  return (
    <div style={{ padding:16 }}>
      {/* Toggle */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
        <span style={{ fontSize:11, color:'#C4A882', cursor:'pointer' }} onClick={() => setHasData(false)}>
          ← 清空数据
        </span>
      </div>

      {/* ★ Today's Training Banner */}
      <Card style={{ marginBottom:12, padding:0, overflow:'hidden', borderRadius:16 }}>
        <div style={{ background:`linear-gradient(135deg, ${ORANGE}, #E85A2A)`, color:'#fff', padding:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <CalendarOutlined style={{ fontSize:16 }} />
              <span style={{ fontSize:13, fontWeight:600 }}>今日训练 · {todayLabel}</span>
            </div>
            <span style={{ fontSize:11, padding:'3px 10px', borderRadius:10, background:'rgba(255,255,255,0.2)', fontWeight:600 }}>
              {todayTraining.completed ? '已完成' : '待完成'}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            {iconMap[todayType.icon] || <AimOutlined style={{ fontSize:28 }} />}
            <div>
              <div style={{ fontSize:20, fontWeight:800 }}>{todayType.label}</div>
              {todayTraining.distance > 0 && (
                <div style={{ fontSize:13, opacity:0.85, marginTop:2 }}>
                  {todayTraining.distance}km · 约{todayTraining.duration}min · RPE {todayTraining.rpe}/10
                </div>
              )}
            </div>
          </div>
          {todayTraining.main && (
            <div style={{ fontSize:12, opacity:0.85, lineHeight:1.5, padding:'8px 12px', background:'rgba(255,255,255,0.12)', borderRadius:8 }}>
              <strong>主课：</strong>{todayTraining.main}
            </div>
          )}
        </div>
        <div style={{ padding:'14px 16px', background:'#FFF9F5' }}>
          {/* Purpose */}
          <div style={{ textAlign:'center', marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:'#C4A882', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>训练目标</div>
            <p style={{ fontSize:12, color:'#8B7355', lineHeight:1.6, margin:0 }}>
              {purposeText[todayTraining.type] || '完成今日训练计划'}
            </p>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom:12 }}>
            {todayTraining.warmup && (
              <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#FFF3E0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FireOutlined style={{ fontSize:12, color:'#FF9800' }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#333', marginBottom:2 }}>热身</div>
                  <div style={{ fontSize:11, color:'#8B7355', lineHeight:1.5 }}>{todayTraining.warmup}</div>
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'#FFF0E8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <ThunderboltOutlined style={{ fontSize:12, color:ORANGE }} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#333', marginBottom:2 }}>主课</div>
                <div style={{ fontSize:12, color:'#333', lineHeight:1.6, fontWeight:500, padding:'8px 10px', background:'#fff', borderRadius:8, border:'0.5px solid #F0E6D8' }}>
                  {todayTraining.main}
                </div>
              </div>
            </div>
            {todayTraining.cooldown && (
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#E8F5E9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <DashboardOutlined style={{ fontSize:12, color:GREEN }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#333', marginBottom:2 }}>放松</div>
                  <div style={{ fontSize:11, color:'#8B7355', lineHeight:1.5 }}>{todayTraining.cooldown}</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats row */}
          {todayTraining.distance > 0 && (
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <div style={{ flex:1, background:'#fff', borderRadius:8, padding:8, textAlign:'center', border:'0.5px solid #F0E6D8' }}>
                <div style={{ fontSize:18, fontWeight:700, color:ORANGE }}>{todayTraining.distance}</div>
                <div style={{ fontSize:10, color:'#C4A882' }}>公里</div>
              </div>
              <div style={{ flex:1, background:'#fff', borderRadius:8, padding:8, textAlign:'center', border:'0.5px solid #F0E6D8' }}>
                <div style={{ fontSize:18, fontWeight:700, color:ORANGE }}>{todayTraining.duration}</div>
                <div style={{ fontSize:10, color:'#C4A882' }}>分钟</div>
              </div>
              <div style={{ flex:1, background:'#fff', borderRadius:8, padding:8, textAlign:'center', border:'0.5px solid #F0E6D8' }}>
                <div style={{ fontSize:18, fontWeight:700, color:ORANGE }}>{todayTraining.rpe}/10</div>
                <div style={{ fontSize:10, color:'#C4A882' }}>RPE</div>
              </div>
            </div>
          )}

          {/* Feel */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14, padding:'8px 10px', background:'#fff', borderRadius:8, border:'0.5px solid #F0E6D8' }}>
            <DashboardOutlined style={{ fontSize:16, color:ORANGE }} />
            <div style={{ fontSize:11, color:'#333' }}>{feelText(todayTraining.rpe)}</div>
          </div>

          {/* RPE dots */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, fontSize:11, color:'#8B7355' }}>
            <span>强度：</span>
            <RPEDots value={todayTraining.rpe} max={10} />
            <span style={{ fontWeight:500 }}>{todayTraining.rpe}/10</span>
          </div>

          <Button color="primary" fill="solid" block
            style={{ backgroundColor: todayTraining.completed ? GREEN : ORANGE, borderColor: todayTraining.completed ? GREEN : ORANGE }}>
            <CheckCircleOutlined /> {todayTraining.completed ? '训练已完成' : '开始训练'}
          </Button>
        </div>
      </Card>

      {/* Week overview + Radar */}
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <Card style={{ flex:1, textAlign:'center', padding:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#333', marginBottom:8 }}>能力画像</div>
          <RadarChart data={DEFAULT_ASSESSMENT} size={120} />
        </Card>
        <Card style={{ flex:1, background:'#FFF0E8', padding:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <AimOutlined style={{ fontSize:16, color:ORANGE }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#333' }}>教练建议</span>
          </div>
          <p style={{ fontSize:11, color:'#333', lineHeight:1.6, margin:0 }}>
            耐力不错！保持轻松跑节奏，周五间歇可以加一组。别忘拉伸~
          </p>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10 }}>
        <Button fill="outline" block style={{ flex:1, borderColor:ORANGE, color:ORANGE }} onClick={onStartOnboarding}>
          <UploadOutlined /> 上传新数据
        </Button>
        <Button fill="outline" block style={{ flex:1, borderColor:'#C4A882', color:'#8B7355' }} onClick={() => onStartOnboarding()}>
          <DashboardOutlined /> 调整偏好
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
