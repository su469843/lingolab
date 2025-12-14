import React, { useEffect, useState } from 'react';
import { Trophy, Award, Flame, Users } from 'lucide-react';

const LeaderboardPage = () => {
    const [stats, setStats] = useState({ wordLeaderboard: [], phoneticLeaderboard: [] });
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/stats/leaderboard');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Fetch leaderboard error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        // Refresh every minute
        const interval = setInterval(fetchLeaderboard, 60000);
        return () => clearInterval(interval);
    }, []);

    const LeaderboardCard = ({ title, icon: Icon, data, color }) => (
        <div className="card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ background: `linear-gradient(135deg, ${color} 0%, white 150%)`, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--surface-100)' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>今日最佳</p>
                </div>
            </div>

            <div style={{ padding: '1rem' }}>
                {data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                        暂无数据，快去练习吧！
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {data.map((item, index) => (
                            <div key={item.userId} style={{
                                display: 'flex', alignItems: 'center', padding: '0.75rem 1rem',
                                background: index < 3 ? 'var(--input-bg)' : 'transparent',
                                borderRadius: '12px', border: '1px solid var(--surface-100)'
                            }}>
                                <div style={{ width: '2rem', fontWeight: 700, fontStyle: 'italic', color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--text-light)' }}>
                                    #{index + 1}
                                </div>
                                <div style={{ flex: 1, fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                                    {item.count} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-light)' }}>个</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '20px', background: 'var(--gradient-primary)', color: 'white', marginBottom: '1rem', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}>
                    <Trophy size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="text-gradient">今日排行榜</h1>
                <p style={{ color: 'var(--text-secondary)' }}>实时更新今日学习成就 ({new Date().toLocaleDateString()})</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <LeaderboardCard
                    title="单词达人榜"
                    icon={Flame}
                    data={stats.wordLeaderboard}
                    color="#fef3c7"
                />
                <LeaderboardCard
                    title="音标大师榜"
                    icon={Award}
                    data={stats.phoneticLeaderboard}
                    color="#dbeafe"
                />
            </div>
        </div>
    );
};

export default LeaderboardPage;
