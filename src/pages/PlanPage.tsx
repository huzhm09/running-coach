import React, { useState } from 'react';
import { Button, Card } from 'antd-mobile';
import {
  LeftOutlined,
  RightOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import RPEDots from '../components/RPEDots';
import { useTrainingStore, TRAINING_TYPES, DAY_LABELS } from '../stores/trainingStore';

const ORANGE = '#FF6B35';
const LIGHT_GRAY = '#F5F5F5';
const GREEN = '#4CAF50';

const weekGoalStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${ORANGE}, #FF9A5C)`,
  borderRadius: 16,
  padding: 20,
  color: '#fff',
  marginBottom: 16,
};

const weekSwitcherStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  marginBottom: 16,
};

const weekNumberStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#333',
};

const modeBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 10,
  backgroundColor: 'rgba(255,255,255,0.3)',
  fontSize: 12,
  marginBottom: 8,
};

const dayCardStyle: React.CSSProperties = {
  marginBottom: 10,
  borderRadius: 12,
  overflow: 'hidden',
  border: 'none',
};

const dayHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
};

const dayBadgeStyle = (type: string, completed: boolean): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  color: '#fff',
  backgroundColor: completed ? GREEN : (TRAINING_TYPES[type]?.color || ORANGE),
  flexShrink: 0,
});

const dayNameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#333',
  flex: 1,
};

const dayStatsStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#999',
  display: 'flex',
  gap: 8,
};

const expandBtnStyle: React.CSSProperties = {
  color: ORANGE,
  fontSize: 12,
  marginLeft: 8,
};

// Timeline in detail
const timelineLineStyle: React.CSSProperties = {
  position: 'absolute',
  left: 12,
  top: 28,
  bottom: 28,
  width: 2,
  backgroundColor: '#E0E0E0',
};

const detailSectionStyle: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 12,
  borderTop: '1px solid #F0F0F0',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 8,
  marginTop: 8,
};

const statGridItemStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 8,
  backgroundColor: LIGHT_GRAY,
  borderRadius: 8,
};

const getTrainingIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'easy-run':
      return <SmileOutlined />;
    case 'interval':
      return <ThunderboltOutlined />;
    case 'tempo':
      return <DashboardOutlined />;
    case 'lsd':
      return <SmileOutlined />;
    case 'recovery':
      return <HeartOutlined />;
    default:
      return <ClockCircleOutlined />;
  }
};

const TRAINING_PURPOSE: Record<string, string> = {
  'easy-run': '保持有氧基础，提升脂肪供能效率，促进恢复',
  'rest': '完全休息，让身体充分恢复',
  'interval': '提升最大摄氧量和速度耐力',
  'tempo': '提升乳酸阈值，提高配速耐力',
  'lsd': '增强心肺耐力，提升长时间运动能力',
  'recovery': '主动恢复，促进血液循环，缓解肌肉酸痛',
};

const PlanPage: React.FC = () => {
  const { currentWeek, setCurrentWeek, weeks } = useTrainingStore();
  const weekData = weeks[currentWeek] || [];
  const totalWeeks = weeks.length;
  const completedDays = weekData.filter((d) => d.completed).length;
  const weekGoal = '完成本周全部训练，稳步提升';

  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleExpand = (dayIdx: number) => {
    setExpandedDay((prev) => (prev === dayIdx ? null : dayIdx));
  };

  const goPrevWeek = () => {
    if (currentWeek > 0) setCurrentWeek(currentWeek - 1);
  };

  const goNextWeek = () => {
    if (currentWeek < totalWeeks - 1) setCurrentWeek(currentWeek + 1);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* ── Header ── */}
      <div style={weekGoalStyle}>
        <div style={modeBadgeStyle}>健康提升</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          第 {currentWeek + 1} 周训练计划
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>
          {weekGoal}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3 }}>
            <div
              style={{
                width: `${(completedDays / 7) * 100}%`,
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: 3,
                transition: 'width 0.3s',
              }}
            />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {completedDays}/7
          </div>
        </div>
      </div>

      {/* ── Week Switcher ── */}
      <div style={weekSwitcherStyle}>
        <Button
          fill="none"
          size="small"
          style={{ color: currentWeek === 0 ? '#D0D0D0' : ORANGE }}
          onClick={goPrevWeek}
          disabled={currentWeek === 0}
        >
          <LeftOutlined />
        </Button>
        <div style={weekNumberStyle}>
          第 {currentWeek + 1} / {totalWeeks} 周
        </div>
        <Button
          fill="none"
          size="small"
          style={{ color: currentWeek >= totalWeeks - 1 ? '#D0D0D0' : ORANGE }}
          onClick={goNextWeek}
          disabled={currentWeek >= totalWeeks - 1}
        >
          <RightOutlined />
        </Button>
      </div>

      {/* ── Day Cards ── */}
      {weekData.map((day, idx) => {
        const isExpanded = expandedDay === idx;
        const typeInfo = TRAINING_TYPES[day.type];
        const typeColor = typeInfo?.color || ORANGE;

        return (
          <Card
            key={idx}
            style={{
              ...dayCardStyle,
              borderLeft: `4px solid ${day.completed ? GREEN : typeColor}`,
            }}
            onClick={() => toggleExpand(idx)}
          >
            <div style={dayHeaderStyle}>
              <div style={dayBadgeStyle(day.type, day.completed)}>
                {day.completed ? <CheckCircleOutlined /> : getTrainingIcon(day.type)}
              </div>
              <div style={dayNameStyle}>
                {DAY_LABELS[idx]}
                <div style={{ fontSize: 12, color: typeColor, fontWeight: 400 }}>
                  {typeInfo?.label || day.type}
                </div>
              </div>
              <div style={dayStatsStyle}>
                {day.distance > 0 && <span>{day.distance}km</span>}
                {day.duration > 0 && <span>{day.duration}min</span>}
              </div>
              <div style={expandBtnStyle}>
                {isExpanded ? <UpOutlined /> : <DownOutlined />}
              </div>
            </div>

            {isExpanded && (
              <div style={detailSectionStyle}>
                {/* Purpose */}
                <div style={{ fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 1.6 }}>
                  {TRAINING_PURPOSE[day.type] || '完成今日训练'}
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative', paddingLeft: 28, marginBottom: 12 }}>
                  <div style={timelineLineStyle} />
                  <div style={{ paddingBottom: 12, position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -20,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#fff',
                      }}
                    >
                      1
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>热身</div>
                    <div style={{ fontSize: 12, color: '#777' }}>{day.warmup || '慢跑 10min + 动态拉伸'}</div>
                  </div>
                  <div style={{ paddingBottom: 12, position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -20,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: ORANGE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#fff',
                      }}
                    >
                      2
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>主课</div>
                    <div style={{ fontSize: 12, color: '#777' }}>{day.main}</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -20,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#42A5F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#fff',
                      }}
                    >
                      3
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>放松</div>
                    <div style={{ fontSize: 12, color: '#777' }}>{day.cooldown || '慢跑 + 静态拉伸'}</div>
                  </div>
                </div>

                {/* HR + Feel + Stats */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, fontSize: 13, color: '#666' }}>
                    <div style={{ fontWeight: 500, color: '#333', marginBottom: 4 }}>心率区间</div>
                    <div>Z2 (130-145)</div>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: '#666' }}>
                    <div style={{ fontWeight: 500, color: '#333', marginBottom: 4 }}>主观感受 RPE</div>
                    <RPEDots value={day.rpe} max={10} size={14} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={statsGridStyle}>
                  <div style={statGridItemStyle}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: ORANGE }}>{day.distance}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>km</div>
                  </div>
                  <div style={statGridItemStyle}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: ORANGE }}>{day.duration}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>分钟</div>
                  </div>
                  <div style={statGridItemStyle}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: ORANGE }}>RPE {day.rpe}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>强度</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default PlanPage;
