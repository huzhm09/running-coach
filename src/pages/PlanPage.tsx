import React, { useState } from 'react';
import { Button } from 'antd-mobile';
import { LeftOutlined, RightOutlined, CheckOutlined, CheckCircleOutlined, EditOutlined, FireOutlined, ThunderboltOutlined, DashboardOutlined, SmileOutlined, CoffeeOutlined, CompassOutlined, HeartOutlined, AimOutlined } from '@ant-design/icons';
import { TRAINING_TYPES, DAY_LABELS, WEEK_SCHEDULE } from '../stores/trainingStore';

const C = {
  primary: '#FF6B35', primaryHover: '#E85A2A', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  border: '#F0E6D8', borderLight: '#F8F2EC',
  surface: '#FFFFFF', green: '#4CAF50', warmBg: '#FFF9F5',
};

const iconNode: Record<string, any> = {
  smile: <SmileOutlined />, coffee: <CoffeeOutlined />, thunderbolt: <ThunderboltOutlined />,
  dashboard: <DashboardOutlined />, compass: <CompassOutlined />, heart: <HeartOutlined />,
};

const purposeText: Record<string, string> = {
  'easy-run': '保持有氧基础，促进恢复，为高强度训练储备体能',
  'interval': '提升最大摄氧量和速度耐力，突破配速瓶颈',
  'tempo': '提高乳酸阈值，让你在比赛配速下更持久',
  'lsd': '建立有氧耐力基础，提升脂肪供能效率',
  'recovery': '主动恢复，促进血液循环，加速肌肉修复',
  'rest': '让身体充分休息，迎接接下来的训练挑战',
};

const PlanPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(3);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const totalWeeks = 12;

  return (
    <div style={{ padding: 16, paddingBottom: 8, boxSizing: 'border-box', overflowX: 'hidden', maxWidth: '100%' }}>
      {currentWeek === 3 && (
        <div style={{ background: C.primaryLight, borderRadius: 16, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: C.text, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
          ↻ 根据你上周的训练完成情况，本周三的间歇跑已降低一组。
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ padding: '4px 12px', borderRadius: 20, background: C.primaryLight, color: C.primary, fontSize: 12, fontWeight: 600 }}>备赛模式 · 半马</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 4 }}>第 {currentWeek} 周 / 共 {totalWeeks} 周</div>
            <div style={{ width: 80, height: 4, background: C.borderLight, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(currentWeek / totalWeeks) * 100}%`, background: `linear-gradient(90deg,${C.primary},${C.primaryHover})`, borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.textSec }}>🎯 目标完赛: 2:00:00</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} disabled={currentWeek <= 1}
          style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', color: currentWeek <= 1 ? C.textTer : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', fontSize: 18 }}>
          <LeftOutlined />
        </button>
        <div style={{ display: 'flex', gap: 4, flex: 1, overflow: 'auto', scrollbarWidth: 'none', padding: '4px 0' }}>
          {Array.from({ length: totalWeeks }, (_, i) => {
            const w = i + 1;
            return (
              <button key={w} onClick={() => setCurrentWeek(w)}
                style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: w === currentWeek ? 700 : 500, background: w === currentWeek ? C.primary : 'transparent', color: w === currentWeek ? '#fff' : C.textSec, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit' }}>
                第{w}周
              </button>
            );
          })}
        </div>
        <button onClick={() => setCurrentWeek(w => Math.min(totalWeeks, w + 1))} disabled={currentWeek >= totalWeeks}
          style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', color: currentWeek >= totalWeeks ? C.textTer : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', fontSize: 18 }}>
          <RightOutlined />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {WEEK_SCHEDULE.map((day, i) => {
          const t = TRAINING_TYPES[day.type];
          const isExpanded = expandedDay === i;
          return (
            <div key={i} style={{
              background: C.surface, borderRadius: 16, padding: 0, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(60,34,24,0.04), 0 2px 8px rgba(60,34,24,0.06)',
              border: `${isExpanded ? 1.5 : 0.5}px solid ${isExpanded ? C.primaryLight : 'rgba(0,0,0,0.04)'}`,
              transition: 'border 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px', cursor: 'pointer' }}
                onClick={() => setExpandedDay(isExpanded ? null : i)}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40, marginRight: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{DAY_LABELS[i]}</span>
                  <span style={{ fontSize: 11, color: C.textTer, marginTop: 2 }}>7/{22 + i}</span>
                </div>
                <span style={{ fontSize: 24, marginRight: 12, color: t.color }}>{iconNode[t.icon] || <AimOutlined />}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t.label}</div>
                  {day.distance > 0 && <div style={{ fontSize: 13, color: C.textSec, marginTop: 3 }}>{day.distance}km · {day.duration}min</div>}
                </div>
                {day.completed && (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                    <CheckOutlined style={{ fontSize: 14, color: '#fff' }} />
                  </div>
                )}
                <RightOutlined style={{ fontSize: 18, color: C.textTer, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
              </div>

              {isExpanded && (
                <div style={{ padding: '14px', borderTop: `0.5px solid ${C.borderLight}`, background: C.warmBg }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textTer, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>训练目标</div>
                    <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, margin: 0, maxWidth: 280, marginInline: 'auto' }}>{purposeText[day.type]}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 16 }}>
                    {day.warmup && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FireOutlined style={{ fontSize: 14, color: '#FF9800' }} />
                          </div>
                          <div style={{ width: 1.5, flex: 1, background: C.borderLight, minHeight: 16 }} />
                        </div>
                        <div style={{ flex: 1, paddingBottom: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>热身</div>
                          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{day.warmup}</div>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ThunderboltOutlined style={{ fontSize: 14, color: C.primary }} />
                        </div>
                        {day.cooldown && <div style={{ width: 1.5, flex: 1, background: C.borderLight, minHeight: 16 }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: day.cooldown ? 12 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>主课</div>
                        <div style={{ background: C.surface, borderRadius: 10, padding: '16px', border: `0.5px solid ${C.borderLight}` }}>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontWeight: 500 }}>{day.main}</div>
                          {day.distance > 0 && (
                            <div style={{ display: 'flex', gap: 12, marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${C.borderLight}` }}>
                              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>{day.distance}</div><div style={{ fontSize: 10, color: C.textTer }}>公里</div></div>
                              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>{day.duration}</div><div style={{ fontSize: 10, color: C.textTer }}>分钟</div></div>
                              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>{day.rpe}/10</div><div style={{ fontSize: 10, color: C.textTer }}>RPE</div></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {day.cooldown && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <DashboardOutlined style={{ fontSize: 14, color: '#4CAF50' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>放松</div>
                          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{day.cooldown}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {day.distance > 0 && (
                    <div style={{ marginBottom: 16, background: C.surface, borderRadius: 10, padding: 12, border: `0.5px solid ${C.borderLight}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textSec, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>♥ 心率区间</div>
                      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2, marginBottom: 8 }}>
                        <div style={{ flex: 1, background: '#E3F2FD' }} />
                        <div style={{ flex: 1, background: '#BBDEFB' }} />
                        <div style={{ flex: 1.5, background: day.type === 'tempo' || day.type === 'interval' ? '#64B5F6' : '#E8E8E8', borderRadius: 2 }} />
                        <div style={{ flex: 1, background: day.type === 'interval' ? '#FFA726' : '#E8E8E8' }} />
                        <div style={{ flex: 0.5, background: '#E8E8E8' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.textTer }}><span>Z1</span><span>Z2</span><span>Z3</span><span>Z4</span><span>Z5</span></div>
                      <div style={{ marginTop: 8, fontSize: 11, color: C.textSec }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: day.type === 'interval' ? '#FFA726' : '#64B5F6', marginRight: 6, verticalAlign: -1 }} />
                        目标：{day.type === 'easy-run' || day.type === 'lsd' ? 'Z2 有氧耐力区 (130-145 bpm)' : day.type === 'tempo' ? 'Z3 乳酸阈区 (155-168 bpm)' : day.type === 'interval' ? 'Z4 最大摄氧量区 (170-185 bpm)' : 'Z1-Z2 恢复区'}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.surface, borderRadius: 10, border: `0.5px solid ${C.borderLight}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <DashboardOutlined style={{ fontSize: 18, color: C.primary }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textSec, marginBottom: 2 }}>体感强度</div>
                      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4 }}>
                        {day.rpe <= 3 ? '非常轻松，可以边跑边聊天' : day.rpe <= 5 ? '舒适努力，呼吸稍快但可持续' : day.rpe <= 7 ? '有些吃力，只能短句交流' : '非常困难，全力以赴'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {day.completed ? (
                      <Button color="success" fill="solid" block style={{ flex: 1, borderRadius: 12, fontWeight: 600 }}>
                        <CheckOutlined style={{ marginRight: 6 }} /> 训练已完成
                      </Button>
                    ) : (
                      <Button color="primary" fill="solid" block style={{ flex: 1, borderRadius: 12, fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none' }}>
                        <CheckCircleOutlined style={{ marginRight: 6 }} /> 开始训练
                      </Button>
                    )}
                    <Button fill="outline" style={{ borderColor: C.border, color: C.textSec, borderRadius: 12 }}>
                      <EditOutlined style={{ marginRight: 6 }} />调整
                    </Button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: C.textTer, cursor: 'pointer' }}
                    onClick={() => setExpandedDay(null)}>收起 ▲</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanPage;
