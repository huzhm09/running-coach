import React, { useState } from 'react';
import { Button, Card, Popup, Dialog, Toast } from 'antd-mobile';
import { EditOutlined, RightOutlined, MailOutlined, LockOutlined, LogoutOutlined, FileTextOutlined, SafetyCertificateOutlined, InfoCircleOutlined, TrophyOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons';

const C = {
  primary: '#FF6B35', primaryHover: '#E85A2A', primaryLight: '#FFF0E8',
  text: '#3C2218', textSec: '#8B7355', textTer: '#C4A882',
  border: '#F0E6D8', borderLight: '#F8F2EC', surface: '#FFFFFF', red: '#EF5350',
};

interface Props { onStartOnboarding: () => void }

const ProfilePage: React.FC<Props> = ({ onStartOnboarding }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const settingRow = (icon: React.ReactNode, label: string, value?: string, onClick?: () => void) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', cursor: 'pointer', borderBottom: `0.5px solid ${C.borderLight}` }} onClick={onClick}>
      <span style={{ marginRight: 12, color: C.textSec }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 15, color: C.text }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: C.textSec, marginRight: 6 }}>{value}</span>}
      <RightOutlined style={{ fontSize: 16, color: C.textTer }} />
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ textAlign: 'center', marginBottom: 16, borderRadius: 16, padding: '20px 16px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28, color: '#fff', fontWeight: 700 }}>张</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>张跑者</div>
        <div style={{ fontSize: 13, color: C.textSec, marginTop: 4 }}>runner@example.com</div>
        <div style={{ marginTop: 8, display: 'inline-block', padding: '3px 12px', borderRadius: 20, background: C.primaryLight, color: C.primary, fontSize: 12, fontWeight: 500 }}>跑龄 1.5 年</div>
        <div style={{ marginTop: 10 }}>
          <Button fill="none" size="small" onClick={() => setShowEdit(true)} style={{ color: C.textSec }}>
            <EditOutlined style={{ marginRight: 4 }} />编辑资料
          </Button>
        </div>
      </Card>

      <Card style={{ marginBottom: 16, borderRadius: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, padding: '12px 16px 6px' }}>训练相关</div>
        {settingRow(<TrophyOutlined />, '当前目标', '半马 · 2:00:00', onStartOnboarding)}
        {settingRow(<HistoryOutlined />, '历史目标', undefined, () => setShowHistory(true))}
      </Card>

      <Card style={{ marginBottom: 16, borderRadius: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, padding: '12px 16px 6px' }}>账号安全</div>
        {settingRow(<MailOutlined />, '修改邮箱')}
        {settingRow(<LockOutlined />, '修改密码')}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }} onClick={() => setShowLogout(true)}>
          <LogoutOutlined style={{ marginRight: 12, color: C.red }} />
          <span style={{ flex: 1, fontSize: 15, color: C.red }}>退出登录</span>
          <RightOutlined style={{ fontSize: 16, color: C.textTer }} />
        </div>
      </Card>

      <Card style={{ marginBottom: 16, borderRadius: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, padding: '12px 16px 6px' }}>其他</div>
        {settingRow(<FileTextOutlined />, '用户协议')}
        {settingRow(<SafetyCertificateOutlined />, '隐私政策')}
        {settingRow(<InfoCircleOutlined />, '关于', 'v1.0.0')}
      </Card>

      {/* Edit Profile Popup */}
      <Popup visible={showEdit} onClose={() => setShowEdit(false)} bodyStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '20px 16px', width:'100%', boxSizing:'border-box', overflow:'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>编辑资料</h3>
          <CloseOutlined style={{ fontSize: 20, color: C.textTer, cursor: 'pointer' }} onClick={() => setShowEdit(false)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>昵称</label>
            <input defaultValue="张跑者" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: 'inherit' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>邮箱</label>
            <input defaultValue="runner@example.com" disabled style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: 'inherit', color: C.textTer, background: '#FAFAFA' }} /></div>
          <Button color="primary" fill="solid" block size="large" style={{ borderRadius: 12, fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`, border: 'none' }}
            onClick={() => { setShowEdit(false); Toast.show({ content: '资料已保存' }); }}>保存</Button>
        </div>
      </Popup>

      {/* History Popup */}
      <Popup visible={showHistory} onClose={() => setShowHistory(false)} bodyStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '20px 16px', width:'100%', boxSizing:'border-box', overflow:'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>历史目标</h3>
          <CloseOutlined style={{ fontSize: 20, color: C.textTer, cursor: 'pointer' }} onClick={() => setShowHistory(false)} />
        </div>
        {[{ goal: '5K突破 25分', date: '2024年3月', done: true }, { goal: '10K入门', date: '2023年10月', done: true }].map(g => (
          <Card key={g.goal} style={{ marginBottom: 8, borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{g.goal}</div><div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{g.date}</div></div>
            {g.done && <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloseOutlined style={{ rotate: '45deg', fontSize: 16, color: '#fff', fontWeight: 'bold' }} /></div>}
          </Card>
        ))}
      </Popup>

      {/* Logout Dialog */}
      <Dialog visible={showLogout} title="确定要退出登录吗？" content="退出后需要重新登录才能使用"
        actions={[
          { key: 'cancel', text: '取消', onClick: () => setShowLogout(false) },
          { key: 'logout', text: '确认退出', danger: true, onClick: () => { setShowLogout(false); Toast.show({ content: '已退出登录' }); } },
        ]}
        onClose={() => setShowLogout(false)} />
    </div>
  );
};

export default ProfilePage;
