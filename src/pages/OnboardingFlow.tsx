import React, { useState, useEffect, useRef } from 'react';
import { Button, Popup, Input, Slider } from 'antd-mobile';
import { CameraOutlined, PictureOutlined, LeftOutlined, EditOutlined, StarOutlined, TrophyOutlined, RiseOutlined, CloseOutlined } from '@ant-design/icons';
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
  const [restDays, setRestDays] = useState<number[]>([1, 3, 5]);
  const [images, setImages] = useState<string[]>([]); // base64 data URLs
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (step === 3) { const t = setTimeout(() => setStep(4), 3000); return () => clearTimeout(t); } }, [step]);

  // Convert file to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Pick from gallery (APK uses Capacitor, browser falls back to file input)
  const pickFromGallery = async () => {
    try {
      const { Camera } = await import('@capacitor/camera');
      const result = await Camera.pickImages({ limit: 5, quality: 80 });
      if (result.photos?.length) {
        const newImages = result.photos.map(p => `data:image/jpeg;base64,${(p as any).dataUrl || p.webPath}`).slice(0, 5);
        setImages(prev => [...prev, ...newImages].slice(0, 5));
        return;
      }
    } catch {}
    fileInputRef.current?.click();
  };

  // Take photo (APK uses Capacitor, browser falls back to file input)
  const takePhoto = async () => {
    try {
      const { Camera, CameraResultType } = await import('@capacitor/camera');
      const result = await Camera.getPhoto({ quality: 80, resultType: CameraResultType.DataUrl });
      if ((result as any).dataUrl) {
        setImages(prev => [...prev, (result as any).dataUrl].slice(0, 5));
        return;
      }
    } catch {}
    fileInputRef.current?.click();
  };

  // Browser file input handler
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const base64 = await fileToBase64(files[i]);
      newImages.push(base64);
    }
    setImages(prev => [...prev, ...newImages].slice(0, 5));
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

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
    <Popup visible bodyStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '88vh', overflow: 'hidden auto', padding: '24px 16px 32px', width: '100%', boxSizing: 'border-box' }}>
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
            <Button fill="outline" block style={{ flex: 1, height: 80, borderRadius: 16, fontSize: 14, fontWeight: 600, color: C.text, borderColor: C.border }}
              onClick={takePhoto}><div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}><CameraOutlined style={{ fontSize: 28, color: C.primary }} />拍照</div></Button>
            <Button fill="outline" block style={{ flex: 1, height: 80, borderRadius: 16, fontSize: 14, fontWeight: 600, color: C.text, borderColor: C.border }}
              onClick={pickFromGallery}><div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}><PictureOutlined style={{ fontSize: 28, color: C.primary }} />从相册选择</div></Button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileInput} style={{ display: 'none' }} />

          {/* Image thumbnails */}
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position:'relative', width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E0E0E0' }}>
                  <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <div onClick={() => removeImage(i)} style={{ position:'absolute', top:2, right:2, width:20, height:20, borderRadius:'50%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    <CloseOutlined style={{ fontSize:10, color:'#fff' }} />
                  </div>
                </div>
              ))}
              {images.length < 5 && (
                <div onClick={pickFromGallery} style={{ width: 80, height: 80, borderRadius: 10, border: '1.5px dashed #E0E0E0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <PictureOutlined style={{ fontSize: 20, color: C.textTer }} />
                </div>
              )}
            </div>
          )}

          {/* Empty placeholder when no images */}
          {images.length === 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1, 2].map(n => (
                <div key={n} onClick={pickFromGallery} style={{ flex: 1, aspectRatio: '4/3', borderRadius: 12, background: '#F5F5F5', border: '1.5px dashed #E0E0E0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                  <PictureOutlined style={{ fontSize: 24, color: C.textTer }} />
                  <span style={{ fontSize: 10, color: C.textTer }}>点击添加截图</span>
                </div>
              ))}
            </div>
          )}

          <Button color="primary" fill="solid" block size="large"
            disabled={images.length === 0}
            style={{ background: images.length === 0 ? '#E0E0E0' : `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none', borderRadius: 12, fontWeight: 600 }}
            onClick={nextStep}>开始识别</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: 'center' }}>识别结果确认</h2>
          <p style={{ fontSize: 12, color: C.textSec, textAlign: 'center', marginBottom: 20 }}>请检查并修正识别结果</p>
          {[{ label: '最近5K成绩', value: "25'30\"" }, { label: '平均配速', value: "5'06\" /km" }, { label: '平均心率', value: '152 bpm' }, { label: '月跑量', value: '85 km' }, { label: '跑步年限', value: '1.5 年' }].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, overflow:'hidden' }}>
              <label style={{ fontSize: 12, color: C.textSec, flexShrink:0, width:75 }}>{f.label}</label>
              <Input defaultValue={f.value} style={{ flex: 1, borderRadius: 10, minWidth:0 } as any} />
              <EditOutlined style={{ fontSize: 14, color: C.textTer, flexShrink:0 }} />
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
