import React, { useState } from 'react';
import { TabBar, Popup } from 'antd-mobile';
import {
  HomeOutlined,
  CalendarOutlined,
  SnippetsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import RecordsPage from './pages/RecordsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingFlow from './pages/OnboardingFlow';
import { useTrainingStore } from './stores/trainingStore';

const ORANGE = '#FF6B35';

const tabs = [
  { key: 'home', title: '首页', icon: <HomeOutlined /> },
  { key: 'plan', title: '计划', icon: <CalendarOutlined /> },
  { key: 'records', title: '记录', icon: <SnippetsOutlined /> },
  { key: 'profile', title: '我的', icon: <UserOutlined /> },
];

const appContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#FAFAFA',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const tabBarStyle: React.CSSProperties = {
  borderTop: '1px solid #F0F0F0',
  backgroundColor: '#fff',
};

const tabBarIconStyle = (active: boolean): React.CSSProperties => ({
  fontSize: 22,
  color: active ? ORANGE : '#999',
});

const onboardingOverlayStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  maxHeight: '90vh',
  overflow: 'hidden',
};

const App: React.FC = () => {
  const hasData = useTrainingStore((s) => s.hasData);
  const setHasData = useTrainingStore((s) => s.setHasData);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const handleStartOnboarding = () => {
    setOnboardingStep(1);
    setOnboardingVisible(true);
  };

  const handleOnboardingComplete = () => {
    setOnboardingVisible(false);
    setHasData(true);
  };

  const handleCloseOnboarding = () => {
    setOnboardingVisible(false);
  };

  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            hasData={hasData}
            setHasData={setHasData}
            onStartOnboarding={handleStartOnboarding}
            onSwitchTab={handleSwitchTab}
          />
        );
      case 'plan':
        return <PlanPage />;
      case 'records':
        return <RecordsPage onStartOnboarding={handleStartOnboarding} />;
      case 'profile':
        return <ProfilePage onStartOnboarding={handleStartOnboarding} />;
      default:
        return null;
    }
  };

  return (
    <div style={appContainerStyle}>
      <div style={contentStyle}>
        {renderPage()}
      </div>

      <TabBar
        activeKey={activeTab}
        onChange={setActiveTab}
        style={tabBarStyle}
      >
        {tabs.map((tab) => (
          <TabBar.Item
            key={tab.key}
            icon={(active: boolean) => (
              <span style={tabBarIconStyle(active)}>{tab.icon}</span>
            )}
            title={
              <span
                style={{
                  fontSize: 11,
                  color: activeTab === tab.key ? ORANGE : '#999',
                }}
              >
                {tab.title}
              </span>
            }
          />
        ))}
      </TabBar>

      {/* ── Onboarding Popup ── */}
      <Popup
        visible={onboardingVisible}
        onMaskClick={handleCloseOnboarding}
        position="bottom"
        bodyStyle={onboardingOverlayStyle}
        destroyOnClose
      >
        <OnboardingFlow
          currentStep={onboardingStep}
          setCurrentStep={setOnboardingStep}
          onComplete={handleOnboardingComplete}
          onClose={handleCloseOnboarding}
        />
      </Popup>
    </div>
  );
};

export default App;
