import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BookOpen, Mic, GraduationCap, TrendingUp, Calendar, ArrowRight, PlayCircle, Star } from 'lucide-react';

const HomePage = () => {
    const { user } = useAuth();
    const { words, sentences } = useData();

    // Mock progress calculation
    const wordsMastered = words.filter(w => w.status === 'MASTERED').length; // Assuming status field exists or will exist
    const totalWords = words.length;
    const progressPercentage = totalWords > 0 ? Math.round((wordsMastered / totalWords) * 100) : 0;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Section */}
            <header className="animate-fade-in" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Welcome back, <span className="text-gradient">{user?.name || user?.username || 'Learner'}</span>!
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    准备好开始今天的学习了吗？坚持就是胜利。
                </p>
            </header>

            {/* Quick Stats Row */}
            <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: '1rem', color: 'var(--primary-600)' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{totalWords}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>已收录单词</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--secondary-50)', borderRadius: '1rem', color: 'var(--secondary-500)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{progressPercentage}%</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>总体掌握度</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#ecfccb', borderRadius: '1rem', color: '#65a30d' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{sentences.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>累计句子</div>
                    </div>
                </div>
            </div>

            {/* Main Actions */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>开始学习</h2>
            <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', animationDelay: '0.1s' }}>

                {/* Phonetics Card */}
                <Link to="/phonetics" className="card hover-scale" style={{ textDecoration: 'none', color: 'inherit', padding: '0', overflow: 'hidden', border: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                <Mic size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>基础</span>
                        </div>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>音标学习</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', margin: 0 }}>掌握 48 个国际音标的标准发音</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>立即开始</span>
                        <ArrowRight size={20} color="var(--primary-600)" />
                    </div>
                </Link>

                {/* Words Card */}
                <Link to="/words" className="card hover-scale" style={{ textDecoration: 'none', color: 'inherit', padding: '0', overflow: 'hidden', border: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                <BookOpen size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>核心</span>
                        </div>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>单词记忆</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', margin: 0 }}>通过科学的记忆曲线高效背词</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#ec4899' }}>继续学习</span>
                        <ArrowRight size={20} color="#ec4899" />
                    </div>
                </Link>

                {/* Sentences Card */}
                <Link to="/sentences" className="card hover-scale" style={{ textDecoration: 'none', color: 'inherit', padding: '0', overflow: 'hidden', border: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                <GraduationCap size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>进阶</span>
                        </div>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>句子练习</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', margin: 0 }}>在真实语境中提升表达能力</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#10b981' }}>开始练习</span>
                        <ArrowRight size={20} color="#10b981" />
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default HomePage;
