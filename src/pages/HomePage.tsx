import React from 'react';
import { Button } from 'antd-mobile';
import { UploadOutlined } from '@ant-design/icons';
import { useTrainingStore } from '../stores/trainingStore';
import type { TrainingDay } from '../types';

interface HomePageProps {
  hasData: boolean;
  setHasData: (v: boolean) => void;
  onStartOnboarding: () => void;
  onSwitchTab: (tab: string) => void;
}

const ORANGE = '#FF6B35';

// ── Empty State ──

const emptyContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 32px',
};

const emptyIconStyle: React.CSSProperties = {
  fontSize: 72,
  color: '#D0D0D0',
  marginBottom: 20,
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: '#333',
  marginBottom: 8,
};

const emptyDescStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#999',
  textAlign: 'center',
  marginBottom: 32,
  lineHeight: 1.6,
};

const uploadBtnStyle: React.CSSProperties = {
  backgroundColor: ORANGE,
  borderColor: ORANGE,
  marginBottom: 12,
};

const skipStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#999',
  cursor: 'pointer',
  textDecoration: 'underline',
};

// ── Helpers ──

const getTodayTraining = (): TrainingDay | null => {
  const store = useTrainingStore.getState();
  const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
  const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0=Mon..6=Sun
  const week = store.weeks[store.currentWeek] || [];
  return week[dayIndex] || null;
};

const HomePage: React.FC<HomePageProps> = ({
  hasData,
  setHasData,
  onStartOnboarding,
}) => {

  // ── No Data State ──
  if (!hasData) {
    return (
      <div style={emptyContainerStyle}>
        <div style={emptyIconStyle}>
          <UploadOutlined />
        </div>
        <div style={emptyTitleStyle}>还没有训练数据</div>
        <div style={emptyDescStyle}>
          上传跑步记录截图，AI将为你生成<br />个性化的训练计划
        </div>
        <Button
          color="primary"
          fill="solid"
          size="large"
          block
          style={uploadBtnStyle}
          onClick={onStartOnboarding}
        >
          <UploadOutlined /> 上传跑步记录
        </Button>
        <div
          style={skipStyle}
          onClick={() => setHasData(true)}
        >
          跳过，使用模拟数据
        </div>
      </div>
    );
  }

  // ── Has Data State ──
  const todayTraining = getTodayTraining();
  if (!todayTraining) return null;

//  const typeColor = TRAINING_TYPES[todayTraining.type]?.color || ORANGE;
//
//  return (
//    <div style={{ padding: 16 }}>
//      {/* ── Banner ── */}
//      <div style={bannerStyle}>
//        <div style={bannerRowStyle}>
//          <div>
//            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>
//              今日训练
//            </div>
//            <div style={{ fontSize: 18, fontWeight: 700 }}>
//              {trainingType?.label || todayTraining.type}
//            </div>
//          </div>
//          <div style={bannerTypeIconStyle}>
//            {getTrainingIcon(todayTraining.type)}
//          </div>
//        </div>
//        <div style={statsRowStyle}>
//          <div style={statItemStyle}>
//            <div style={statValueStyle}>{todayTraining.distance}</div>
//            <div style={statLabelStyle}>km</div>
//          </div>
//          <div style={statItemStyle}>
//            <div style={statValueStyle}>{todayTraining.duration}</div>
//            <div style={statLabelStyle}>分钟</div>
//          </div>
//          <div style={statItemStyle}>
//            <div style={statValueStyle}>RPE {todayTraining.rpe}</div>
//            <div style={statLabelStyle}>强度</div>
//          </div>
//        </div>
//      </div>
//
//      {/* ── Training Purpose ── */}
//      <Card style={{ marginBottom: 12 }}>
//        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
//          {TRAINING_PURPOSE[todayTraining.type] || '提升跑步能力'}
//        </div>
//      </Card>
//
//      {/* ── Timeline ── */}
//      <Card title={<span style={{ fontSize: 15, fontWeight: 600 }}>训练流程</span>} style={{ marginBottom: 12 }}>
//        <div style={timelineStyle}>
//          <div style={timelineLineStyle} />
//          <div style={timelineItemStyle}>
//            <div style={{ ...timelineDotBase, backgroundColor: '#4CAF50' }}>1</div>
//            <div style={timelineContentStyle}>
//              <div style={timelineTitleStyle}>热身 Warm-up</div>
//              <div style={timelineDescStyle}>
//                {todayTraining.warmup || '轻度慢跑 + 动态拉伸'}
//              </div>
//            </div>
//          </div>
//          <div style={timelineItemStyle}>
//            <div style={{ ...timelineDotBase, backgroundColor: ORANGE }}>2</div>
//            <div style={timelineContentStyle}>
//              <div style={timelineTitleStyle}>主课 Main</div>
//              <div style={timelineDescStyle}>
//                {todayTraining.main || '主训练内容'}
//              </div>
//            </div>
//          </div>
//          <div style={timelineItemStyle}>
//            <div style={{ ...timelineDotBase, backgroundColor: '#42A5F5' }}>3</div>
//            <div style={timelineContentStyle}>
//              <div style={timelineTitleStyle}>放松 Cool-down</div>
//              <div style={timelineDescStyle}>
//                {todayTraining.cooldown || '慢跑 + 静态拉伸'}
//              </div>
//            </div>
//          </div>
//        </div>
//      </Card>
//
//      {/* ── HR Zones + RPE ── */}
//      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
//        <Card style={{ flex: 1, margin: 0 }}>
//          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#333' }}>
//            心率区间
//          </div>
//          {HR_ZONES.map((zone) => (
//            <div
//              key={zone.label}
//              style={{
//                display: 'flex',
//                alignItems: 'center',
//                gap: 6,
//                marginBottom: 6,
//              }}
//            >
//              <div
//                style={{
//                  width: 28,
//                  fontSize: 11,
//                  fontWeight: 600,
//                  color: zone.color,
//                }}
//              >
//                {zone.label}
//              </div>
//              <div style={{ flex: 1, height: 8, backgroundColor: LIGHT_GRAY, borderRadius: 4 }}>
//                <div
//                  style={{
//                    width: `${zone.pct}%`,
//                    height: '100%',
//                    backgroundColor: zone.color,
//                    borderRadius: 4,
//                  }}
//                />
//              </div>
//              <div style={{ fontSize: 11, color: '#999', width: 36, textAlign: 'right' }}>
//                {zone.range}
//              </div>
//            </div>
//          ))}
//        </Card>
//        <Card style={{ flex: 1, margin: 0 }}>
//          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#333' }}>
//            主观感受 RPE
//          </div>
//          <RPEDots value={todayTraining.rpe} max={10} />
//          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
//            强度等级：{todayTraining.rpe <= 3 ? '轻松' : todayTraining.rpe <= 5 ? '适中' : todayTraining.rpe <= 7 ? '困难' : '非常困难'}
//          </div>
//        </Card>
//      </div>
//
//      {/* ── Action Button ── */}
//      <div style={{ marginBottom: 12 }}>
//        <Button
//          color="primary"
//          fill="solid"
//          block
//          size="large"
//          style={{
//            backgroundColor: todayTraining.completed ? '#999' : ORANGE,
//            borderColor: todayTraining.completed ? '#999' : ORANGE,
//            marginBottom: 8,
//          }}
//          onClick={() => {
//            const store = useTrainingStore.getState();
//            store.toggleDayComplete(store.currentWeek, todayTraining.day);
//          }}
//        >
//          {todayTraining.completed ? (
//            <><CheckCircleOutlined /> 训练已完成</>
//          ) : (
//            <>开始训练</>
//          )}
//        </Button>
//        <Button
//          fill="none"
//          block
//          size="small"
//          style={{ color: ORANGE }}
//          onClick={() => onSwitchTab('plan')}
//        >
//          查看周计划 <RightOutlined />
//        </Button>
//      </div>
//
//      {/* ── Week Overview ── */}
//      <Card title={<span style={{ fontSize: 15, fontWeight: 600 }}>本周跑量</span>} style={{ marginBottom: 12 }}>
//        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, padding: '8px 0' }}>
//          {WEEKLY_RUN_DATA.map((km, i) => (
//            <div
//              key={i}
//              style={{
//                display: 'flex',
//                flexDirection: 'column',
//                alignItems: 'center',
//                gap: 4,
//                flex: 1,
//              }}
//            >
//              <div
//                style={{
//                  width: 24,
//                  height: `${(km / WEEKLY_MAX) * 60}px`,
//                  backgroundColor: km > 0 ? ORANGE : LIGHT_GRAY,
//                  borderRadius: '6px 6px 0 0',
//                  transition: 'height 0.3s',
//                }}
//              />
//              <div style={{ fontSize: 10, color: '#999' }}>{DAY_LABELS[i].slice(0, 1)}</div>
//            </div>
//          ))}
//        </div>
//        <div style={{ fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4 }}>
//          本周总计 {WEEKLY_RUN_DATA.reduce((a, b) => a + b, 0).toFixed(1)} km
//        </div>
//      </Card>
//
//      {/* ── Radar + Coach ── */}
//      <div style={{ display: 'flex', gap: 12 }}>
//        <Card style={{ flex: 1, margin: 0 }}>
//          <div style={{ display: 'flex', justifyContent: 'center' }}>
//            <RadarChart data={assessment} size={140} />
//          </div>
//        </Card>
//        <Card style={{ flex: 1, margin: 0 }}>
//          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#333' }}>
//            教练建议
//          </div>
//          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
//            今天训练状态良好，注意控制心率在Z2区间，保持节奏稳定。
//          </div>
//        </Card>
//      </div>
//    </div>
//  );
};

export default HomePage;
