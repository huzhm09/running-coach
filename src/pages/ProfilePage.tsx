import React, { useState } from 'react';
import { Button, Card, Popup, Dialog, Toast, Input } from 'antd-mobile';
import {
  UserOutlined,
  EditOutlined,
  RightOutlined,
  LogoutOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  AimOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { HistoryGoal } from '../types';

interface ProfilePageProps {
  onStartOnboarding: () => void;
}

const ORANGE = '#FF6B35';
const LIGHT_GRAY = '#F5F5F5';

const profileHeaderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 16px 24px',
};

const avatarStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: ORANGE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 36,
  color: '#fff',
  marginBottom: 12,
};

const nameStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#333',
  marginBottom: 4,
};

const emailStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#999',
  marginBottom: 12,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  backgroundColor: 'rgba(255, 107, 53, 0.1)',
  color: ORANGE,
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 500,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#666',
  padding: '12px 16px 8px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #F5F5F5',
  cursor: 'pointer',
};

const rowLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const rowIconStyle: React.CSSProperties = {
  fontSize: 18,
  color: ORANGE,
  width: 24,
  textAlign: 'center',
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 15,
  color: '#333',
};

const rowRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#C0C0C0',
  fontSize: 13,
};

const historyGoals: HistoryGoal[] = [
  { goal: '完成首个10公里', date: '2024.03', done: true },
  { goal: '半马破2', date: '2024.06', done: true },
  { goal: '全马完赛', date: '2025.01', done: false },
  { goal: '10公里跑进45分', date: '2025.06', done: false },
];

const settingSections = [
  {
    title: '训练相关',
    rows: [
      { icon: <BellOutlined />, label: '训练提醒', right: '已开启' },
      { icon: <FileTextOutlined />, label: '导出训练报告', right: '' },
      { icon: <AimOutlined />, label: '历史目标', right: '' },
    ],
  },
  {
    title: '账号安全',
    rows: [
      { icon: <SafetyCertificateOutlined />, label: '修改密码', right: '' },
      { icon: <UserOutlined />, label: '账号绑定', right: '微信' },
    ],
  },
  {
    title: '其他',
    rows: [
      { icon: <QuestionCircleOutlined />, label: '帮助与反馈', right: '' },
      { icon: <StarOutlined />, label: '关于我们', right: 'v1.0.0' },
    ],
  },
];

const PopupContent: React.CSSProperties = {
  padding: 24,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  backgroundColor: '#fff',
};

const popupTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#333',
  textAlign: 'center',
  marginBottom: 20,
};

const ProfilePage: React.FC<ProfilePageProps> = ({ onStartOnboarding }) => {
  const [editVisible, setEditVisible] = useState(false);
  const [goalsVisible, setGoalsVisible] = useState(false);
  const [nickname, setNickname] = useState('跑者小明');
  const [email, setEmail] = useState('runner@example.com');
  const [runningAge, setRunningAge] = useState('2');

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      onConfirm: () => {
        Toast.show({ content: '已退出登录', duration: 1500 });
      },
    });
  };

  const handleSaveProfile = () => {
    setEditVisible(false);
    Toast.show({ content: '资料已保存', duration: 1500 });
  };

  const handleRowClick = (label: string) => {
    switch (label) {
      case '历史目标':
        setGoalsVisible(true);
        break;
      case '训练提醒':
        Toast.show({ content: '训练提醒设置已打开', duration: 1000 });
        break;
      case '导出训练报告':
        Toast.show({ content: '正在生成训练报告...', duration: 1000 });
        break;
      case '修改密码':
        Toast.show({ content: '密码修改功能已打开', duration: 1000 });
        break;
      case '账号绑定':
        Toast.show({ content: '账号绑定设置已打开', duration: 1000 });
        break;
      case '帮助与反馈':
        Toast.show({ content: '帮助与反馈页面已打开', duration: 1000 });
        break;
      case '关于我们':
        Toast.show({ content: 'running-coach v1.0.0', duration: 1500 });
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* ── Profile Header ── */}
      <div style={profileHeaderStyle}>
        <div style={avatarStyle}>
          <UserOutlined />
        </div>
        <div style={nameStyle}>{nickname}</div>
        <div style={emailStyle}>{email}</div>
        <div style={badgeStyle}>跑龄 {runningAge} 年</div>

        <Button
          size="small"
          fill="none"
          style={{
            marginTop: 16,
            color: ORANGE,
            borderColor: ORANGE,
            borderRadius: 16,
            padding: '2px 16px',
          }}
          onClick={() => setEditVisible(true)}
        >
          <EditOutlined /> 编辑资料
        </Button>
      </div>

      {/* ── Stats Card ── */}
      <Card style={{ margin: '0 16px 16px', borderRadius: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '8px 0' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: ORANGE }}>186</div>
            <div style={{ fontSize: 12, color: '#999' }}>本月跑量 (km)</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: ORANGE }}>12</div>
            <div style={{ fontSize: 12, color: '#999' }}>本月次数</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: ORANGE }}>5'32"</div>
            <div style={{ fontSize: 12, color: '#999' }}>平均配速</div>
          </div>
        </div>
      </Card>

      {/* ── Settings Sections ── */}
      {settingSections.map((section) => (
        <div key={section.title} style={{ marginBottom: 8 }}>
          <div style={sectionTitleStyle}>{section.title}</div>
          <div style={{ backgroundColor: '#fff', margin: '0 16px', borderRadius: 12, overflow: 'hidden' }}>
            {section.rows.map((row, idx) => (
              <div
                key={idx}
                style={{
                  ...rowStyle,
                  borderBottom: idx < section.rows.length - 1 ? '1px solid #F5F5F5' : 'none',
                }}
                onClick={() => handleRowClick(row.label)}
              >
                <div style={rowLeftStyle}>
                  <span style={rowIconStyle}>{row.icon}</span>
                  <span style={rowLabelStyle}>{row.label}</span>
                </div>
                <div style={rowRightStyle}>
                  {row.right && <span style={{ color: '#999' }}>{row.right}</span>}
                  <RightOutlined />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Logout Button ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <Button
          fill="none"
          block
          style={{
            color: RED,
            borderColor: RED,
            borderRadius: 8,
          }}
          onClick={handleLogout}
        >
          <LogoutOutlined /> 退出登录
        </Button>
      </div>

      {/* ── Edit Profile Popup ── */}
      <Popup
        visible={editVisible}
        onMaskClick={() => setEditVisible(false)}
        position="bottom"
        bodyStyle={{ ...PopupContent, maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div style={popupTitleStyle}>编辑资料</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>昵称</div>
          <Input value={nickname} onChange={setNickname} placeholder="请输入昵称" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>邮箱</div>
          <Input value={email} onChange={setEmail} placeholder="请输入邮箱" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>跑步年限</div>
          <Input value={runningAge} onChange={setRunningAge} placeholder="请输入跑步年限" />
        </div>

        <Button
          color="primary"
          fill="solid"
          block
          style={{
            backgroundColor: ORANGE,
            borderColor: ORANGE,
            marginBottom: 8,
          }}
          onClick={handleSaveProfile}
        >
          保存
        </Button>
        <Button
          fill="none"
          block
          style={{ color: '#999' }}
          onClick={() => setEditVisible(false)}
        >
          取消
        </Button>
      </Popup>

      {/* ── History Goals Popup ── */}
      <Popup
        visible={goalsVisible}
        onMaskClick={() => setGoalsVisible(false)}
        position="bottom"
        bodyStyle={{ ...PopupContent, maxHeight: '60vh', overflowY: 'auto' }}
      >
        <div style={popupTitleStyle}>历史目标</div>

        {historyGoals.map((goal, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: idx < historyGoals.length - 1 ? '1px solid #F0F0F0' : 'none',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: goal.done ? 'rgba(76, 175, 80, 0.1)' : LIGHT_GRAY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: goal.done ? '#4CAF50' : '#C0C0C0',
                fontSize: 16,
              }}
            >
              {goal.done ? '✓' : '○'}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: goal.done ? 400 : 500,
                  color: goal.done ? '#999' : '#333',
                  textDecoration: goal.done ? 'line-through' : 'none',
                }}
              >
                {goal.goal}
              </div>
              <div style={{ fontSize: 12, color: '#C0C0C0' }}>{goal.date}</div>
            </div>
          </div>
        ))}

        <Button
          fill="none"
          block
          style={{ color: ORANGE, marginTop: 16 }}
          onClick={onStartOnboarding}
        >
          添加新目标
        </Button>
      </Popup>
    </div>
  );
};

const RED = '#F44336';

export default ProfilePage;
