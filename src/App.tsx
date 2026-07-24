import React, { useState } from 'react';
import { TabBar } from 'antd-mobile';
import { HomeOutlined, CalendarOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import RecordsPage from './pages/RecordsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingFlow from './pages/OnboardingFlow';

const C = {
  primary: '#FF6B35', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  surface: '#FFFFFF', tabInactive: '#C4A882',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [hasData, setHasData] = useState(false);
  const [onboarding, setOnboarding] = useState({ show: false, step: 1 });

  const tabs = [
    { key: 'home', title: '首页', icon: (active: boolean) => <HomeOutlined style={{ fontSize: 24, color: active ? C.primary : C.tabInactive }} /> },
    { key: 'plan', title: '计划', icon: (active: boolean) => <CalendarOutlined style={{ fontSize: 24, color: active ? C.primary : C.tabInactive }} /> },
    { key: 'records', title: '记录', icon: (active: boolean) => <SnippetsOutlined style={{ fontSize: 24, color: active ? C.primary : C.tabInactive }} /> },
    { key: 'profile', title: '我的', icon: (active: boolean) => <UserOutlined style={{ fontSize: 24, color: active ? C.primary : C.tabInactive }} /> },
  ];

  const startOnboarding = (step = 1) => setOnboarding({ show: true, step });
  const closeOnboarding = () => setOnboarding({ show: false, step: 1 });
  const finishOnboarding = () => { setHasData(true); setOnboarding({ show: false, step: 1 }); setActiveTab('plan'); };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#FFF9F5', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 'env(safe-area-inset-top, 0px)', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'home' && <HomePage hasData={hasData} setHasData={setHasData} onStartOnboarding={startOnboarding} onSwitchTab={setActiveTab} />}
        {activeTab === 'plan' && <PlanPage />}
        {activeTab === 'records' && <RecordsPage onStartOnboarding={() => startOnboarding(1)} />}
        {activeTab === 'profile' && <ProfilePage onStartOnboarding={() => startOnboarding(5)} />}
      </div>

      {/* Tab Bar */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)' }}>
        <TabBar activeKey={activeTab} onChange={setActiveTab} style={{} as any}>
          {tabs.map(t => (
            <TabBar.Item key={t.key} icon={t.icon(activeTab === t.key)} title={t.title} />
          ))}
        </TabBar>
      </div>

      {/* Onboarding Overlay */}
      {onboarding.show && (
        <OnboardingFlow step={onboarding.step} setStep={(s) => setOnboarding(o => ({ ...o, step: s }))} onClose={closeOnboarding} onFinish={finishOnboarding} />
      )}
    </div>
  );
};

export default App;
