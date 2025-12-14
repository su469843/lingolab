import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Moon, Bell, Shield, Mail } from 'lucide-react';

const SettingsPage = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="page-title">账户设置 (Settings)</h1>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={40} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user?.name || user?.username}</h2>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>@{user?.username} · {user?.role}</div>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '1rem 1.5rem', background: 'var(--surface-50)', fontWeight: 600, borderBottom: '1px solid var(--surface-100)' }}>
                    偏好设置
                </div>
                <div className="setting-item">
                    <div className="setting-icon"><Moon size={20} /></div>
                    <div className="setting-content">
                        <div className="setting-label">深色模式</div>
                        <div className="setting-desc">切换应用外观主题</div>
                    </div>
                    <div className="toggle-switch"></div>
                </div>
                <div className="setting-item">
                    <div className="setting-icon"><Bell size={20} /></div>
                    <div className="setting-content">
                        <div className="setting-label">学习提醒</div>
                        <div className="setting-desc">每日词汇推送通知</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">配置</button>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden', padding: 0, marginTop: '2rem' }}>
                <div style={{ padding: '1rem 1.5rem', background: 'var(--surface-50)', fontWeight: 600, borderBottom: '1px solid var(--surface-100)' }}>
                    账户安全
                </div>
                <div className="setting-item">
                    <div className="setting-icon"><Mail size={20} /></div>
                    <div className="setting-content">
                        <div className="setting-label">绑定邮箱</div>
                        <div className="setting-desc">未绑定</div>
                    </div>
                    <button className="btn btn-primary btn-sm">立即绑定</button>
                </div>
                <div className="setting-item">
                    <div className="setting-icon"><Shield size={20} /></div>
                    <div className="setting-content">
                        <div className="setting-label">修改密码</div>
                        <div className="setting-desc">定期修改密码以保护账号安全</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">修改</button>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button onClick={logout} className="btn" style={{ color: '#ef4444', border: '1px solid #fee2e2', background: '#fef2f2', padding: '0.75rem 2rem' }}>
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> 退出登录
                </button>
            </div>

            <style>{`
                .setting-item {
                    display: flex;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--surface-100);
                }
                .setting-item:last-child {
                    border-bottom: none;
                }
                .setting-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: var(--surface-100);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1rem;
                }
                .setting-content {
                    flex: 1;
                }
                .setting-label {
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }
                .setting-desc {
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                .toggle-switch {
                    width: 44px;
                    height: 24px;
                    background: var(--surface-200);
                    border-radius: 99px;
                    position: relative;
                    cursor: pointer;
                }
                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    left: 2px;
                    top: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                }
                .btn-sm {
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                }
            `}</style>
        </div>
    );
};

export default SettingsPage;
