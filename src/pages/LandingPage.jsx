import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100" style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '1rem 0', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 50, borderBottom: '1px solid var(--surface-100)' }}>
                <div className="container flex-center" style={{ justifyContent: 'space-between' }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '0.75rem', color: 'white', display: 'flex' }}>
                            <GraduationCap size={24} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>LingoLab</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                            开始学习
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ paddingTop: '8rem', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
                            <Sparkles size={16} />
                            <span>新一代英语学习体验</span>
                        </div>

                        <h1 className="animate-slide-up" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            掌握英语，<br />
                            <span className="text-gradient">开启无限可能</span>
                        </h1>

                        <p className="animate-slide-up" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.8, animationDelay: '0.1s' }}>
                            不仅仅是背单词。通过科学的记忆曲线、真实的语境和智能语音分析，LingoLab 让你的英语学习事半功倍。
                        </p>

                        <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animationDelay: '0.2s' }}>
                            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                免费开始 <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                已经有账号？
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--primary-200)', filter: 'blur(100px)', opacity: 0.3, borderRadius: '50%', zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', background: 'var(--secondary-500)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%', zIndex: -1 }}></div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>为什么选择 LingoLab？</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Feature 1 */}
                        <div className="card">
                            <div style={{ width: 50, height: 50, background: 'var(--primary-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)', marginBottom: '1.5rem' }}>
                                <BookOpen size={24} />
                            </div>
                            <h3>科学记忆</h3>
                            <p>基于艾宾浩斯记忆曲线，智能安排复习时间，告别死记硬背。</p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> 智能复习调度
                                </div>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> 长期记忆强化
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="card">
                            <div style={{ width: 50, height: 50, background: 'var(--primary-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)', marginBottom: '1.5rem' }}>
                                <Sparkles size={24} />
                            </div>
                            <h3>音标纠正</h3>
                            <p>视觉化的音标学习系统，配合发音示例，助你练就地道口语。</p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> IPA 国际音标
                                </div>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> 实时发音反馈
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="card">
                            <div style={{ width: 50, height: 50, background: 'var(--primary-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)', marginBottom: '1.5rem' }}>
                                <GraduationCap size={24} />
                            </div>
                            <h3>全方位提升</h3>
                            <p>从单词到句子，从听说到读写，构建完整的语言能力闭环。</p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> 听力训练
                                </div>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <CheckCircle2 size={16} color="var(--primary-500)" /> 情景例句
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p>&copy; 2024 LingoLab. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
