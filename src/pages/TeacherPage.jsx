import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save } from 'lucide-react';

const TeacherPage = () => {
    const { words, sentences, addWord, deleteWord, addSentence, deleteSentence } = useData();
    const [activeTab, setActiveTab] = useState('words');

    // Forms State
    const [newWord, setNewWord] = useState({ word: '', phonetic: '', meaning: '', example: '' });
    const [newSentence, setNewSentence] = useState({ text: '', translation: '' });

    const handleAddWord = (e) => {
        e.preventDefault();
        if (!newWord.word) return;
        addWord(newWord);
        setNewWord({ word: '', phonetic: '', meaning: '', example: '' });
    };

    const handleAddSentence = (e) => {
        e.preventDefault();
        if (!newSentence.text) return;
        addSentence(newSentence);
        setNewSentence({ text: '', translation: '' });
    };

    return (
        <div className="page-container">
            <h2 className="page-title">教师内容管理后台</h2>

            <div className="tab-buttons" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'words' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('words')}
                >
                    单词管理 ({words.length})
                </button>
                <button
                    className={`btn ${activeTab === 'sentences' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('sentences')}
                >
                    句子管理 ({sentences.length})
                </button>
            </div>

            {activeTab === 'words' && (
                <div className="dashboard-section">
                    {/* Add Word Form */}
                    <div className="card form-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>添加新单词</h3>
                        <form onSubmit={handleAddWord} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <input
                                type="text" placeholder="单词 (Word)" className="input-field"
                                value={newWord.word} onChange={e => setNewWord({ ...newWord, word: e.target.value })}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="text" placeholder="音标 (Phonetic)" className="input-field"
                                value={newWord.phonetic} onChange={e => setNewWord({ ...newWord, phonetic: e.target.value })}
                                style={inputStyle}
                            />
                            <input
                                type="text" placeholder="中文释义 (Meaning)" className="input-field"
                                value={newWord.meaning} onChange={e => setNewWord({ ...newWord, meaning: e.target.value })}
                                style={inputStyle}
                            />
                            <input
                                type="text" placeholder="例句 (Example)" className="input-field"
                                value={newWord.example} onChange={e => setNewWord({ ...newWord, example: e.target.value })}
                                style={{ ...inputStyle, gridColumn: '1 / -1' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> 添加单词
                            </button>
                        </form>
                    </div>

                    {/* Word List */}
                    <div className="list-container">
                        {words.map(item => (
                            <div key={item.id} className="list-item" style={itemStyle}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.word} <span style={{ color: 'var(--text-light)', fontWeight: 400, marginLeft: '0.5rem' }}>{item.phonetic}</span></div>
                                    <div style={{ color: 'var(--text-medium)' }}>{item.meaning}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{item.example}</div>
                                </div>
                                <button onClick={() => deleteWord(item.id)} className="btn-icon" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'sentences' && (
                <div className="dashboard-section">
                    {/* Add Sentence Form */}
                    <div className="card form-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>添加新句子</h3>
                        <form onSubmit={handleAddSentence} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <input
                                type="text" placeholder="英文句子 (English Sentence)" className="input-field"
                                value={newSentence.text} onChange={e => setNewSentence({ ...newSentence, text: e.target.value })}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="text" placeholder="中文翻译 (Chinese Translation)" className="input-field"
                                value={newSentence.translation} onChange={e => setNewSentence({ ...newSentence, translation: e.target.value })}
                                required
                                style={inputStyle}
                            />
                            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> 添加句子
                            </button>
                        </form>
                    </div>

                    {/* Sentence List */}
                    <div className="list-container">
                        {sentences.map(item => (
                            <div key={item.id} className="list-item" style={itemStyle}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{item.text}</div>
                                    <div style={{ color: 'var(--text-medium)' }}>{item.translation}</div>
                                </div>
                                <button onClick={() => deleteSentence(item.id)} className="btn-icon" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Inline styles for simplicity in prototype, normally would be classes
const inputStyle = {
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    fontSize: '1rem',
    width: '100%'
};

const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    marginBottom: '0.75rem'
};

export default TeacherPage;
