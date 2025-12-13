import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, GraduationCap, Settings, Home } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: '首页', icon: Home },
        { path: '/phonetics', label: '音标学习', icon: Mic },
        { path: '/words', label: '单词学习', icon: BookOpen },
        { path: '/sentences', label: '句子学习', icon: GraduationCap },
        { path: '/teacher', label: '教师后台', icon: Settings },
    ];

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <GraduationCap className="logo-icon" />
                    <h1 className="logo-text">LingoLab</h1>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
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
