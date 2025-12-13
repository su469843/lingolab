import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, BookOpen, MessageSquare, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Hero Section with Gradient Background */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>AI 驱动的英语学习平台</span>
                    </div>
                    <h1 className="hero-title">
                        欢迎来到 <span className="gradient-text">LingoLab</span>
                    </h1>
                    <p className="hero-subtitle">
                        您的私人英语学习助手 · 掌握音标、单词与句子的最佳伴侣
                    </p>
                    <div className="hero-actions">
                        <Link to="/phonetics" className="btn btn-primary btn-large">
                            <Volume2 size={20} />
                            开始学习音标
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/words" className="btn btn-secondary btn-large">
                            <BookOpen size={20} />
                            背单词
                        </Link>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="floating-card card-1">
                        <Volume2 size={32} />
                    </div>
                    <div className="floating-card card-2">
                        <BookOpen size={32} />
                    </div>
                    <div className="floating-card card-3">
                        <MessageSquare size={32} />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <h2 className="section-title">核心功能</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Volume2 size={32} />
                        </div>
                        <h3>音标学习</h3>
                        <p>掌握 48 个国际音标的标准发音，打好英语基础</p>
                        <ul className="feature-list">
                            <li><CheckCircle size={16} /> 标准发音示范</li>
                            <li><CheckCircle size={16} /> 互动练习模式</li>
                            <li><CheckCircle size={16} /> 实时语音反馈</li>
                        </ul>
                    </div>
                    <div className="feature-card featured">
                        <div className="feature-badge">推荐</div>
                        <div className="feature-icon">
                            <BookOpen size={32} />
                        </div>
                        <h3>单词记忆</h3>
                        <p>基于艾宾浩斯遗忘曲线的科学复习系统</p>
                        <ul className="feature-list">
                            <li><CheckCircle size={16} /> 智能复习提醒</li>
                            <li><CheckCircle size={16} /> 个性化学习计划</li>
                            <li><CheckCircle size={16} /> 进度追踪分析</li>
                        </ul>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <MessageSquare size={32} />
                        </div>
                        <h3>句子练习</h3>
                        <p>通过真实语境提升英语表达能力</p>
                        <ul className="feature-list">
                            <li><CheckCircle size={16} /> 实用句型库</li>
                            <li><CheckCircle size={16} /> 情景对话练习</li>
                            <li><CheckCircle size={16} /> 发音纠正</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">48</div>
                        <div className="stat-label">国际音标</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">常用单词</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">实用句子</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">随时学习</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
