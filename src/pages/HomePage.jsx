import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="page-container home-page">
            <header className="hero-section">
                <h1 className="hero-title">欢迎来到 LingoLab</h1>
                <p className="hero-subtitle">您的私人英语学习助手 - 掌握音标、单词与句子的最佳伴侣。</p>
                <div className="hero-actions">
                    <Link to="/phonetics" className="btn btn-primary">开始学习音标</Link>
                    <Link to="/words" className="btn btn-secondary">背单词</Link>
                </div>
            </header>

            <div className="features-grid">
                <div className="feature-card">
                    <h3>音标学习</h3>
                    <p>掌握 48 个国际音标的标准发音。</p>
                </div>
                <div className="feature-card">
                    <h3>单词记忆</h3>
                    <p>基于艾宾浩斯遗忘曲线的单词复习。</p>
                </div>
                <div className="feature-card">
                    <h3>发音测评</h3>
                    <p>实时语音评分，纠正您的发音。</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
