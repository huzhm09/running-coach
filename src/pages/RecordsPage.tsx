import React, { useState } from 'react';
import { RECORDS, TRAINING_TYPES, WEEKLY_CHART, DAY_LABELS, PACE_TREND } from '../stores/trainingStore';
import { UnorderedListOutlined, BarChartOutlined, PlusOutlined, RightOutlined, HeartOutlined, AimOutlined, DashboardOutlined, ThunderboltOutlined, SmileOutlined, CoffeeOutlined, CompassOutlined } from '@ant-design/icons';

const C = {
  primary: '#FF6B35', primaryHover: '#E85A2A', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  border: '#F0E6D8', borderLight: '#F8F2EC',
  surface: '#FFFFFF', green: '#4CAF50', red: '#EF5350', yellow: '#FFA726',
  greenBg: '#E8F5E9', redBg: '#FFEBEE', yellowBg: '#FFF8E1',
};

const iconNode: Record<string, any> = {
  smile: <SmileOutlined />, coffee: <CoffeeOutlined />, thunderbolt: <ThunderboltOutlined />,
  dashboard: <DashboardOutlined />, compass: <CompassOutlined />, heart: <HeartOutlined />,
};

interface Props { onStartOnboarding: () => void }

const RecordsPage: React.FC<Props> = ({ onStartOnboarding }) => {
  const [view, setView] = useState<'list' | 'stats'>('list');
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const statusColors: Record<string, string> = { green: C.green, yellow: C.yellow, red: C.red };
  const statusBgs: Record<string, string> = { green: C.greenBg, yellow: C.yellowBg, red: C.redBg };

  return (
    <div style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', marginBottom: 14, background: C.borderLight, borderRadius: 10, padding: 3 }}>
        <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: view === 'list' ? 600 : 500, background: view === 'list' ? C.surface : 'transparent', color: view === 'list' ? C.text : C.textSec, fontFamily: 'inherit' }}
          onClick={() => setView('list')}><UnorderedListOutlined style={{ marginRight: 4 }} />列表</button>
        <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: view === 'stats' ? 600 : 500, background: view === 'stats' ? C.surface : 'transparent', color: view === 'stats' ? C.text : C.textSec, fontFamily: 'inherit' }}
          onClick={() => setView('stats')}><BarChartOutlined style={{ marginRight: 4 }} />统计</button>
      </div>

      {view === 'list' ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>2024年7月</div>
          {RECORDS.map((rec, i) => {
            const t = TRAINING_TYPES[rec.type];
            const isExpanded = expandedRecord === i;
            return (
              <div key={i} style={{ background: C.surface, borderRadius: 16, padding: 0, overflow: 'hidden', borderLeft: `3px solid ${statusColors[rec.statusColor]}`, marginBottom: 8, boxShadow: '0 1px 3px rgba(60,34,24,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', cursor: 'pointer' }}
                  onClick={() => setExpandedRecord(isExpanded ? null : i)}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 44, marginRight: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{rec.date}</span>
                    <span style={{ fontSize: 11, color: C.textTer, marginTop: 2 }}>{rec.day}</span>
                  </div>
                  <span style={{ fontSize: 22, marginRight: 10, color: t.color }}>{iconNode[t.icon] || <AimOutlined />}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t.label}</div>
                    {rec.distance > 0 ? <div style={{ fontSize: 12, color: C.textSec, marginTop: 3 }}>{rec.distance}km · {rec.pace} · {rec.duration}min</div> : <div style={{ fontSize: 12, color: C.textTer, marginTop: 3 }}>—</div>}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: statusBgs[rec.statusColor], color: statusColors[rec.statusColor], whiteSpace: 'nowrap' }}>{rec.statusLabel}</span>
                  <RightOutlined style={{ fontSize: 16, color: C.textTer, marginLeft: 4, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                </div>
                {isExpanded && rec.distance > 0 && (
                  <div style={{ padding: '0 14px 14px', borderTop: `0.5px solid ${C.borderLight}` }}>
                    <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 12, color: C.textSec, marginBottom: 8 }}>
                      <span><HeartOutlined style={{ marginRight: 4 }} />心率 {rec.hr} bpm</span>
                      <span><AimOutlined style={{ marginRight: 4 }} />体感 {rec.rpe}/10</span>
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: statusBgs[rec.statusColor], color: statusColors[rec.statusColor], fontWeight: 600 }}>
                      {rec.status === 'done' ? '✅' : rec.status === 'warn' ? '⚠️' : '❌'} {rec.statusLabel}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ background: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, textAlign: 'center', boxShadow: '0 1px 3px rgba(60,34,24,0.04)' }}>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 10 }}>周跑量 (km)</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, height: 120 }}>
              {WEEKLY_CHART.map((km, i) => {
                const maxKm = Math.max(...WEEKLY_CHART);
                const h = maxKm > 0 ? (km / maxKm) * 100 : 0;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: km > 0 ? C.primary : C.textTer, fontWeight: 600 }}>{km > 0 ? km : ''}</span>
                    <div style={{ width: 28, height: Math.max(h, 2), background: km > 0 ? `linear-gradient(180deg,${C.primary},${C.primaryHover})` : C.borderLight, borderRadius: '4px 4px 0 0' }} />
                    <span style={{ fontSize: 10, color: C.textTer }}>{DAY_LABELS[i].replace('周', '')}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 8 }}>总计 {WEEKLY_CHART.reduce((a, b) => a + b, 0).toFixed(1)} km</div>
          </div>

          <div style={{ background: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(60,34,24,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: '周跑量', value: '20.1km' }, { label: '训练次数', value: '4次' }, { label: '平均配速', value: "5'56\"" }, { label: '完成率', value: '71%' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(60,34,24,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>📈 配速趋势 (近4周)</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
              {PACE_TREND.map((p, i) => (
                <React.Fragment key={i}>
                  <span style={{ color: i === PACE_TREND.length - 1 ? C.primary : C.textSec, fontWeight: i === PACE_TREND.length - 1 ? 700 : 400 }}>{p}</span>
                  {i < PACE_TREND.length - 1 && <span style={{ color: C.green }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={onStartOnboarding} style={{
        position: 'fixed', bottom: 100, right: 24, width: 48, height: 48, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, color: '#fff', border: 'none',
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
      }}><PlusOutlined /></button>
    </div>
  );
};

export default RecordsPage;
