import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, GraduationCap, Settings, Home, LogOut, User as UserIcon, ClipboardList, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: '首页', icon: Home, roles: ['STUDENT', 'TEACHER', 'VISITOR'] },
        { path: '/phonetics', label: '音标学习', icon: Mic, roles: ['STUDENT', 'TEACHER', 'VISITOR'] },
        { path: '/words', label: '单词学习', icon: BookOpen, roles: ['STUDENT', 'TEACHER', 'VISITOR'] },
        { path: '/sentences', label: '句子学习', icon: GraduationCap, roles: ['STUDENT', 'TEACHER', 'VISITOR'] },
        { path: '/homework', label: '作业中心', icon: ClipboardList, roles: ['STUDENT'] },
        { path: '/teacher', label: '教师后台', icon: LayoutDashboard, roles: ['TEACHER'] },
        { path: '/settings', label: '设置', icon: Settings, roles: ['STUDENT', 'TEACHER', 'VISITOR'] },
    ];

    const filteredNav = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <GraduationCap className="logo-icon" />
                    <h1 className="logo-text">LingoLab</h1>
                </div>

                <nav className="sidebar-nav">
                    {filteredNav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <Icon className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '0.75rem' }}>
                            <UserIcon size={20} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || user?.username}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{user?.role === 'TEACHER' ? '老师' : '学生'}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.5rem' }}
                    >
                        <LogOut size={16} style={{ marginRight: '0.5rem' }} /> 退出登录
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
