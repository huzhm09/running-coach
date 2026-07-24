import React, { useState } from 'react';
import { Button, Stepper, Slider, Input, Toast } from 'antd-mobile';
import {
  UploadOutlined,
  CameraOutlined,
  PictureOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import RadarChart from '../components/RadarChart';
import { DEFAULT_ASSESSMENT } from '../stores/trainingStore';
import type { OCRResult } from '../types';

interface OnboardingFlowProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
  onClose: () => void;
}

const ORANGE = '#FF6B35';
const LIGHT_GRAY = '#F5F5F5';

const contentStyle: React.CSSProperties = {
  padding: 24,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const titleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: 8,
  color: '#333',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#999',
  textAlign: 'center',
  marginBottom: 24,
};

const stepIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 24,
};

const stepDotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#E0E0E0',
  transition: 'all 0.3s',
};

const stepDotActiveStyle: React.CSSProperties = {
  ...stepDotStyle,
  width: 24,
  backgroundColor: ORANGE,
};

const uploadAreaStyle: React.CSSProperties = {
  border: `2px dashed ${ORANGE}`,
  borderRadius: 16,
  padding: 40,
  textAlign: 'center',
  backgroundColor: 'rgba(255, 107, 53, 0.05)',
  marginBottom: 16,
};

const uploadIconStyle: React.CSSProperties = {
  fontSize: 48,
  color: ORANGE,
  marginBottom: 12,
};

const thumbnailRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
  marginTop: 16,
};

const thumbnailStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 8,
  backgroundColor: '#E0E0E0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  color: '#999',
};

const fieldRowStyle: React.CSSProperties = {
  marginBottom: 16,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#666',
  marginBottom: 4,
  fontWeight: 500,
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 0',
};

const spinnerStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  border: `4px solid ${LIGHT_GRAY}`,
  borderTopColor: ORANGE,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: 20,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#333',
  marginBottom: 12,
  marginTop: 20,
};

const modeToggleStyle: React.CSSProperties = {
  display: 'flex',
  borderRadius: 8,
  overflow: 'hidden',
  border: `1px solid ${ORANGE}`,
  marginBottom: 16,
};

const modeOptionStyle: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  padding: '10px 0',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const mockOCRResult: OCRResult = {
  recent5k: '23:45',
  avgPace: '5\'12"/km',
  avgHeartRate: '152',
  monthlyMileage: '180',
  runTypes: ['轻松跑', '间歇跑', '节奏跑'],
  runningYears: '2',
};

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentStep,
  setCurrentStep,
  onComplete,
}) => {
  const [ocrResult, setOcrResult] = useState<OCRResult>(mockOCRResult);
  const [mode, setMode] = useState<'race' | 'improve'>('improve');
  const [goalDistance, setGoalDistance] = useState('');
  const [goalTime, setGoalTime] = useState('');
  const [weeklyDays, setWeeklyDays] = useState(4);
  const [maxDuration, setMaxDuration] = useState(60);
  const [intensity, setIntensity] = useState(50);
  const [restDays, setRestDays] = useState<number[]>([1, 4]);
  const [injuries, setInjuries] = useState('');

  const toggleRestDay = (day: number) => {
    setRestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const renderStepIndicator = () => (
    <div style={stepIndicatorStyle}>
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          style={s === currentStep ? stepDotActiveStyle : stepDotStyle}
        />
      ))}
    </div>
  );

  const renderStep1Upload = () => (
    <div>
      <div style={titleStyle}>上传跑步记录截图</div>
      <div style={subtitleStyle}>从跑步APP截图中导入数据，快速生成训练计划</div>

      <div style={uploadAreaStyle}>
        <div style={uploadIconStyle}>
          <UploadOutlined />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 8 }}>
          点击上传截图
        </div>
        <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
          支持 JPG / PNG 格式
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button
            color="primary"
            fill="solid"
            size="small"
            style={{ backgroundColor: ORANGE, borderColor: ORANGE }}
          >
            <CameraOutlined /> 拍照
          </Button>
          <Button
            color="primary"
            fill="none"
            size="small"
            style={{ color: ORANGE, borderColor: ORANGE }}
          >
            <PictureOutlined /> 相册
          </Button>
        </div>
      </div>

      <div style={subtitleStyle}>或选择模拟数据</div>
      <div style={thumbnailRowStyle}>
        <div style={thumbnailStyle}>🏃</div>
        <div style={thumbnailStyle}>📊</div>
        <div style={thumbnailStyle}>📱</div>
      </div>
    </div>
  );

  const renderStep2Recognition = () => (
    <div>
      <div style={titleStyle}>确认识别结果</div>
      <div style={subtitleStyle}>AI已从截图中识别出以下数据，请确认或修改</div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>最近5公里成绩</div>
        <Input
          value={ocrResult.recent5k}
          onChange={(v) => setOcrResult((prev) => ({ ...prev, recent5k: v }))}
          placeholder="例如 23:45"
        />
      </div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>平均配速</div>
        <Input
          value={ocrResult.avgPace}
          onChange={(v) => setOcrResult((prev) => ({ ...prev, avgPace: v }))}
          placeholder="例如 5'12/km"
        />
      </div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>平均心率</div>
        <Input
          value={ocrResult.avgHeartRate}
          onChange={(v) => setOcrResult((prev) => ({ ...prev, avgHeartRate: v }))}
          placeholder="例如 152"
        />
      </div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>月跑量 (km)</div>
        <Input
          value={ocrResult.monthlyMileage}
          onChange={(v) => setOcrResult((prev) => ({ ...prev, monthlyMileage: v }))}
          placeholder="例如 180"
        />
      </div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>跑步年限</div>
        <Input
          value={ocrResult.runningYears}
          onChange={(v) => setOcrResult((prev) => ({ ...prev, runningYears: v }))}
          placeholder="例如 2"
        />
      </div>

      <div style={fieldRowStyle}>
        <div style={fieldLabelStyle}>偏好跑步类型</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ocrResult.runTypes.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '4px 12px',
                borderRadius: 12,
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                color: ORANGE,
                fontSize: 13,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3Analyzing = () => (
    <div>
      <div style={titleStyle}>AI 分析中</div>
      <div style={subtitleStyle}>正在评估你的跑步能力并生成训练计划...</div>

      <div style={loadingContainerStyle}>
        <div style={spinnerStyle} />
        <div style={{ fontSize: 15, color: '#666', marginBottom: 8 }}>分析跑步数据中...</div>
        <div style={{ fontSize: 13, color: '#999' }}>请稍候，这需要几秒钟</div>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: LIGHT_GRAY,
        }}
      >
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>分析步骤</div>
        {['解析跑步截图', '评估能力维度', '生成训练计划', '优化训练安排'].map(
          (step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 0',
                fontSize: 13,
                color: i < 2 ? ORANGE : '#999',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: i < 2 ? ORANGE : '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {i < 2 ? <CheckOutlined /> : i + 1}
              </div>
              <span>{step}</span>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderStep4Assessment = () => (
    <div>
      <div style={titleStyle}>能力评估结果</div>
      <div style={subtitleStyle}>基于你的跑步数据，AI对你的能力评估如下</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <RadarChart data={DEFAULT_ASSESSMENT} size={200} />
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: LIGHT_GRAY,
          fontSize: 14,
          color: '#555',
          lineHeight: 1.6,
        }}
      >
        {DEFAULT_ASSESSMENT.summary}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginTop: 16,
        }}
      >
        {[
          { label: '耐力', value: DEFAULT_ASSESSMENT.endurance, color: '#4CAF50' },
          { label: '速度', value: DEFAULT_ASSESSMENT.speed, color: '#FFA726' },
          { label: '力量', value: DEFAULT_ASSESSMENT.strength, color: '#42A5F5' },
          { label: '恢复', value: DEFAULT_ASSESSMENT.recovery, color: '#7E57C2' },
          { label: '跑量', value: DEFAULT_ASSESSMENT.mileage, color: '#EC407A' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: '#fff',
              border: '1px solid #F0F0F0',
            }}
          >
            <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep5Preferences = () => (
    <div>
      <div style={titleStyle}>训练偏好设置</div>
      <div style={subtitleStyle}>配置你的训练目标和偏好，AI将据此生成个性化计划</div>

      <div style={sectionTitleStyle}>训练模式</div>
      <div style={modeToggleStyle}>
        <div
          style={{
            ...modeOptionStyle,
            backgroundColor: mode === 'race' ? ORANGE : '#fff',
            color: mode === 'race' ? '#fff' : '#666',
          }}
          onClick={() => setMode('race')}
        >
          比赛模式
        </div>
        <div
          style={{
            ...modeOptionStyle,
            backgroundColor: mode === 'improve' ? ORANGE : '#fff',
            color: mode === 'improve' ? '#fff' : '#666',
          }}
          onClick={() => setMode('improve')}
        >
          健康提升
        </div>
      </div>

      <div style={sectionTitleStyle}>目标距离 (km)</div>
      <Input
        value={goalDistance}
        onChange={setGoalDistance}
        placeholder="例如 21.0975（半马）"
      />

      <div style={{ ...sectionTitleStyle, marginTop: 20 }}>目标完赛时间</div>
      <Input
        value={goalTime}
        onChange={setGoalTime}
        placeholder="例如 1:45:00"
      />

      <div style={sectionTitleStyle}>每周训练天数</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <Stepper
          value={weeklyDays}
          onChange={setWeeklyDays}
          min={2}
          max={7}
        />
      </div>

      <div style={sectionTitleStyle}>单次最长训练 (分钟)</div>
      <div style={{ padding: '0 8px' }}>
        <Slider
          value={maxDuration}
          onChange={(v) => setMaxDuration(v as number)}
          min={30}
          max={180}
          step={10}
          ticks={true}
        />
        <div style={{ textAlign: 'center', fontSize: 14, color: ORANGE, fontWeight: 600 }}>
          {maxDuration} 分钟
        </div>
      </div>

      <div style={sectionTitleStyle}>训练强度</div>
      <div style={{ padding: '0 8px' }}>
        <Slider
          value={intensity}
          onChange={(v) => setIntensity(v as number)}
          min={0}
          max={100}
          step={5}
          ticks={true}
        />
        <div style={{ textAlign: 'center', fontSize: 14, color: ORANGE, fontWeight: 600 }}>
          {intensity < 30 ? '低' : intensity < 70 ? '中' : '高'}
        </div>
      </div>

      <div style={sectionTitleStyle}>休息日</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {WEEKDAYS.map((day, i) => (
          <div
            key={i}
            onClick={() => toggleRestDay(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 16,
              backgroundColor: restDays.includes(i)
                ? 'rgba(255, 107, 53, 0.1)'
                : LIGHT_GRAY,
              color: restDays.includes(i) ? ORANGE : '#666',
              fontSize: 13,
              fontWeight: restDays.includes(i) ? 600 : 400,
              cursor: 'pointer',
              border: restDays.includes(i)
                ? `1px solid ${ORANGE}`
                : '1px solid #E0E0E0',
              transition: 'all 0.2s',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={sectionTitleStyle}>伤病史 (可选)</div>
      <Input
        value={injuries}
        onChange={setInjuries}
        placeholder="例如：膝盖不适、足底筋膜炎..."
      />
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1Upload();
      case 2:
        return renderStep2Recognition();
      case 3:
        return renderStep3Analyzing();
      case 4:
        return renderStep4Assessment();
      case 5:
        return renderStep5Preferences();
      default:
        return null;
    }
  };

  const canGoNext = () => {
    return true;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      Toast.show({ content: '训练计划已生成！', duration: 2000 });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextLabel = () => {
    if (currentStep < 5) return '下一步';
    return '完成';
  };

  return (
    <div style={contentStyle}>
      {renderStepIndicator()}
      {renderStep()}

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 24,
          paddingBottom: 16,
        }}
      >
        {currentStep > 1 && (
          <Button
            fill="none"
            style={{ flex: 1, color: '#666', borderColor: '#D0D0D0' }}
            onClick={handlePrev}
          >
            <ArrowLeftOutlined /> 上一步
          </Button>
        )}
        <Button
          color="primary"
          fill="solid"
          style={{
            flex: 1,
            backgroundColor: ORANGE,
            borderColor: ORANGE,
          }}
          onClick={handleNext}
          disabled={!canGoNext()}
        >
          {getNextLabel()} {currentStep < 5 && <ArrowRightOutlined />}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
