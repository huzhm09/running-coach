import React, { useState } from 'react';
import { Card } from 'antd-mobile';
import {
  UnorderedListOutlined,
  BarChartOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import RPEDots from '../components/RPEDots';
import { useTrainingStore, TRAINING_TYPES, DAY_LABELS, PACE_TREND } from '../stores/trainingStore';

interface RecordsPageProps {
  onStartOnboarding: () => void;
}

const ORANGE = '#FF6B35';
const LIGHT_GRAY = '#F5F5F5';
const GREEN = '#4CAF50';
const YELLOW = '#FFA726';
const RED = '#F44336';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  done: <CheckCircleOutlined style={{ color: GREEN }} />,
  warn: <ExclamationCircleOutlined style={{ color: YELLOW }} />,
  miss: <CloseCircleOutlined style={{ color: RED }} />,
};

const toggleContainerStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: LIGHT_GRAY,
  borderRadius: 8,
  padding: 2,
  marginBottom: 16,
};

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  textAlign: 'center',
  padding: '8px 0',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: active ? '#fff' : 'transparent',
  color: active ? ORANGE : '#999',
  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
  transition: 'all 0.2s',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
});

const recordCardStyle: React.CSSProperties = {
  marginBottom: 10,
  borderRadius: 12,
  overflow: 'hidden',
  border: 'none',
};

const recordHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 0',
};

const statusStripeStyle = (color: string): React.CSSProperties => ({
  width: 4,
  borderRadius: 2,
  backgroundColor: color,
  flexShrink: 0,
  alignSelf: 'stretch',
});

const dateStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#333',
};

const dayLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#999',
};

const recordStatsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  marginLeft: 'auto',
  fontSize: 13,
  color: '#666',
};

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  right: 24,
  bottom: 80,
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: ORANGE,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
  border: 'none',
  cursor: 'pointer',
  zIndex: 100,
};

// ── Stats View Components ──

const barContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  height: 100,
  padding: '8px 0',
};

const barWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  flex: 1,
};

const barStyle = (height: number, color: string): React.CSSProperties => ({
  width: 28,
  height,
  backgroundColor: color,
  borderRadius: '6px 6px 0 0',
  transition: 'height 0.3s',
});

const barLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#999',
};

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 16,
};

const summaryItemStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  backgroundColor: '#fff',
  border: '1px solid #F0F0F0',
  textAlign: 'center',
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'done':
      return GREEN;
    case 'warn':
      return YELLOW;
    case 'miss':
      return RED;
    default:
      return '#999';
  }
};

const RecordsPage: React.FC<RecordsPageProps> = ({ onStartOnboarding }) => {
  const { records } = useTrainingStore();
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedRecord((prev) => (prev === idx ? null : idx));
  };

  // Stats calculations
  const totalDistance = records.reduce((sum, r) => sum + r.distance, 0);
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const avgRpe = Math.round(records.filter((r) => r.rpe > 0).reduce((sum, r) => sum + r.rpe, 0) / Math.max(records.filter((r) => r.rpe > 0).length, 1));
  const completedCount = records.filter((r) => r.status === 'done').length;
  const completionRate = Math.round((completedCount / records.length) * 100);
  const weeklyRuns = records.map((r) => r.distance);
  const maxDist = Math.max(...weeklyRuns, 1);

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* ── Toggle ── */}
      <div style={toggleContainerStyle}>
        <button
          style={toggleBtnStyle(viewMode === 'list')}
          onClick={() => setViewMode('list')}
        >
          <UnorderedListOutlined /> 列表
        </button>
        <button
          style={toggleBtnStyle(viewMode === 'stats')}
          onClick={() => setViewMode('stats')}
        >
          <BarChartOutlined /> 统计
        </button>
      </div>

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <div>
          {records.map((record, idx) => {
            const isExpanded = expandedRecord === idx;
            const typeInfo = TRAINING_TYPES[record.type];
            const statusColor = getStatusColor(record.status);

            return (
              <Card
                key={idx}
                style={recordCardStyle}
                onClick={() => toggleExpand(idx)}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={statusStripeStyle(statusColor)} />
                  <div style={{ flex: 1 }}>
                    <div style={recordHeaderStyle}>
                      <div>
                        <div style={dateStyle}>{record.date}</div>
                        <div style={dayLabelStyle}>{record.day} · {typeInfo?.label || record.type}</div>
                      </div>
                      <div style={recordStatsStyle}>
                        {record.distance > 0 && <span>{record.distance}km</span>}
                        {record.pace !== '-' && <span>{record.pace}</span>}
                      </div>
                      <div style={{ color: ORANGE, fontSize: 12 }}>
                        {isExpanded ? <UpOutlined /> : <DownOutlined />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '8px 0 12px', borderTop: '1px solid #F0F0F0', marginTop: 4 }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, color: '#666' }}>
                            配速: <strong>{record.pace}</strong>
                          </div>
                          <div style={{ fontSize: 13, color: '#666' }}>
                            时长: <strong>{record.duration}min</strong>
                          </div>
                          {record.hr > 0 && (
                            <div style={{ fontSize: 13, color: '#666' }}>
                              心率: <strong>{record.hr}</strong>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <RPEDots value={record.rpe} max={10} size={14} />
                          <div style={{ fontSize: 12, color: '#999' }}>
                            {STATUS_ICONS[record.status]} {record.statusLabel}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Stats View ── */}
      {viewMode === 'stats' && (
        <div>
          {/* Summary Grid */}
          <div style={summaryGridStyle}>
            <div style={summaryItemStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: ORANGE }}>{totalDistance.toFixed(1)}</div>
              <div style={{ fontSize: 13, color: '#999' }}>本周跑量 (km)</div>
            </div>
            <div style={summaryItemStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: ORANGE }}>{totalDuration}</div>
              <div style={{ fontSize: 13, color: '#999' }}>总时长 (min)</div>
            </div>
            <div style={summaryItemStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: ORANGE }}>{avgRpe}</div>
              <div style={{ fontSize: 13, color: '#999' }}>平均RPE</div>
            </div>
            <div style={summaryItemStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: ORANGE }}>{completionRate}%</div>
              <div style={{ fontSize: 13, color: '#999' }}>完成率</div>
            </div>
          </div>

          {/* Bar Chart */}
          <Card title={<span style={{ fontSize: 15, fontWeight: 600 }}>每日跑量 (km)</span>} style={{ marginBottom: 16 }}>
            <div style={barContainerStyle}>
              {weeklyRuns.map((km, i) => {
                const barH = maxDist > 0 ? (km / maxDist) * 80 : 0;
                const color = km > 0 ? ORANGE : LIGHT_GRAY;
                return (
                  <div key={i} style={barWrapperStyle}>
                    <div style={barStyle(Math.max(barH, 4), color)} />
                    <div style={barLabelStyle}>{km.toFixed(1)}</div>
                    <div style={barLabelStyle}>{DAY_LABELS[i]?.slice(0, 1)}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Pace Trend */}
          <Card title={<span style={{ fontSize: 15, fontWeight: 600 }}>配速趋势</span>} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              {PACE_TREND.map((pace, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: ORANGE }}>{pace}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>第{i + 1}周</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 }}>
              配速呈稳步提升趋势
            </div>
          </Card>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        style={fabStyle}
        onClick={onStartOnboarding}
      >
        <PlusOutlined />
      </button>
    </div>
  );
};

export default RecordsPage;
