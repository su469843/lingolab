import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import WordsPractice from '../components/WordsPractice';
import { Book, RotateCcw, GraduationCap, LayoutGrid, Search, PlusCircle } from 'lucide-react';

const WordsPage = () => {
    const { words } = useData();
    const [view, setView] = useState('list'); // 'list', 'practice'

    // Simple mock filter
    const [searchTerm, setSearchTerm] = useState('');
    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.meaning.includes(searchTerm)
    );

    if (view === 'practice') {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => setView('list')}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <LayoutGrid size={18} />
                        返回列表
                    </button>
                </div>
                <div className="animate-slide-up">
                    <WordsPractice words={words} />
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--secondary-50)', borderRadius: '12px', color: 'var(--secondary-500)' }}>
                            <Book size={28} />
                        </div>
                        单词库
                    </h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        已收录 {words.length} 个单词，持续积累中
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setView('practice')}
                        className="btn btn-primary"
                        disabled={words.length === 0}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                    >
                        <GraduationCap size={20} />
                        开始练习
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        type="text"
                        placeholder="搜索单词..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Placeholder for Add Word if teacher? Or maybe just status filter */}
            </div>

            {words.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--surface-100)' }}>
                    <div style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                        <Book size={48} style={{ opacity: 0.2 }} />
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>暂无单词，请等待老师发布或前往后台添加。</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {filteredWords.map(word => (
                        <div key={word.id} className="card hover-scale" style={{ padding: '1.5rem', position: 'relative' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                                {word.word}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontFamily: 'serif', marginBottom: '0.75rem' }}>
                                {word.phonetic}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                {word.meaning}
                            </div>

                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }}>
                                <Book size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WordsPage;
