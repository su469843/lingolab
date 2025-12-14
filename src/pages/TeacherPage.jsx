import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Users, User, Book, MessageSquare, ClipboardList, BookOpen } from 'lucide-react';

const TeacherPage = () => {
    const { words, sentences, addWord, deleteWord, addSentence, deleteSentence } = useData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('words');
    const [students, setStudents] = useState([]);

    // Homework State
    const [homeworks, setHomeworks] = useState([]);
    const [newHomework, setNewHomework] = useState({ title: '', type: 'WORD', contentIds: [], deadline: '' });
    const [selectedItems, setSelectedItems] = useState([]);

    // Forms State
    const [newWord, setNewWord] = useState({ word: '', phonetic: '', meaning: '', example: '' });
    const [newSentence, setNewSentence] = useState({ text: '', translation: '' });

    // Textbook State
    const [textbooks, setTextbooks] = useState([]);
    const [newTextbook, setNewTextbook] = useState({ title: '', description: '' });
    const [batchText, setBatchText] = useState('');
    const [expandedBookId, setExpandedBookId] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchStudents = async () => {
            // Mock fetch since auth might not be fully wired to backend in this env
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setStudents(data.students || []);
                }
            } catch (error) { console.error("Fetch students error", error); }
        };

        const fetchHomeworks = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/homework', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setHomeworks(await res.json());
            } catch (e) { console.error(e); }
        };

        const fetchTextbooks = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/textbooks', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setTextbooks(await res.json());
            } catch (e) { console.error(e); }
        };

        if (activeTab === 'students') fetchStudents();
        if (activeTab === 'homework') fetchHomeworks();
        if (activeTab === 'textbooks') fetchTextbooks();
    }, [activeTab, user]);

    const handleCreateTextbook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/textbooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newTextbook)
            });
            if (res.ok) {
                alert('教材创建成功');
                setNewTextbook({ title: '', description: '' });
                // Re-fetch logic simplified for brevity
            }
        } catch (error) { console.error(error); }
    };

    const handleBatchAddWords = async (bookId) => {
        // ... (Keep existing logic, updating API calls if needed)
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/textbooks/batch?id=${bookId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ text: batchText })
            });
            if (res.ok) {
                alert('批量添加成功!');
                setBatchText('');
                setExpandedBookId(null);
            }
        } catch (error) { console.error(error); }
    };

    const handleCreateHomework = async (e) => {
        e.preventDefault();
        // ... (Keep existing logic)
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/homework', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...newHomework, contentIds: selectedItems })
            });
            if (res.ok) {
                alert('作业布置成功!');
                setNewHomework({ title: '', type: 'WORD', contentIds: [], deadline: '' });
                setSelectedItems([]);
            }
        } catch (error) { console.error(error); }
    };

    const toggleSelection = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

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

    const TabButton = ({ id, label, icon: Icon, count }) => (
        <button
            className={`btn ${activeTab === id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(id)}
            style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', flex: 1, justifyContent: 'flex-start', border: activeTab === id ? 'none' : '1px solid transparent' }}
        >
            <Icon size={18} />
            <span>{label}</span>
            {count !== undefined && <span style={{ marginLeft: 'auto', background: activeTab === id ? 'rgba(255,255,255,0.2)' : 'var(--surface-100)', padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.8rem' }}>{count}</span>}
        </button>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>

            {/* Sidebar Navigation for Teacher Panel */}
            <div className="card" style={{ padding: '1rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingLeft: '0.5rem', borderLeft: '4px solid var(--primary-500)' }}>教师后台</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <TabButton id="words" label="单词管理" icon={Book} count={words.length} />
                    <TabButton id="sentences" label="句子管理" icon={MessageSquare} count={sentences.length} />
                    <TabButton id="students" label="我的学生" icon={Users} count={students.length} />
                    <TabButton id="homework" label="作业发布" icon={ClipboardList} />
                    <TabButton id="textbooks" label="教材管理" icon={BookOpen} />
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                {activeTab === 'textbooks' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>创建新教材</h3>
                            <form onSubmit={handleCreateTextbook} style={{ display: 'grid', gap: '1rem' }}>
                                <input type="text" placeholder="教材名称" className="input-field" value={newTextbook.title} onChange={e => setNewTextbook({ ...newTextbook, title: e.target.value })} required />
                                <input type="text" placeholder="描述" className="input-field" value={newTextbook.description} onChange={e => setNewTextbook({ ...newTextbook, description: e.target.value })} />
                                <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}><Plus size={18} /> 创建</button>
                            </form>
                        </div>
                        {/* List items (Simplified for brevity, similar refactoring as below) */}
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {textbooks.map(book => (
                                <div key={book.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{book.title}</div>
                                        <div style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>{book.description}</div>
                                    </div>
                                    <button className="btn btn-secondary" onClick={() => setExpandedBookId(expandedBookId === book.id ? null : book.id)}>
                                        {expandedBookId === book.id ? '收起' : '管理'}
                                    </button>
                                </div>
                            ))}
                            {expandedBookId && (
                                <div className="card animate-slide-up" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-500)' }}>
                                    <textarea
                                        className="input-field"
                                        rows="5"
                                        placeholder="批量粘贴单词：Word [Phonetic] Meaning"
                                        value={batchText}
                                        onChange={e => setBatchText(e.target.value)}
                                        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                    />
                                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleBatchAddWords(expandedBookId)}>确认添加</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'words' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>录入新单词</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className={`btn ${!newWord.isBatch ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setNewWord({ ...newWord, isBatch: false })}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >单条录入</button>
                                    <button
                                        className={`btn ${newWord.isBatch ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setNewWord({ ...newWord, isBatch: true })}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >批量录入</button>
                                </div>
                            </div>

                            {!newWord.isBatch ? (
                                <form onSubmit={handleAddWord} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <input type="text" placeholder="单词" className="input-field" value={newWord.word} onChange={e => setNewWord({ ...newWord, word: e.target.value })} required />
                                    <input type="text" placeholder="音标" className="input-field" value={newWord.phonetic} onChange={e => setNewWord({ ...newWord, phonetic: e.target.value })} />
                                    <input type="text" placeholder="释义" className="input-field" value={newWord.meaning} onChange={e => setNewWord({ ...newWord, meaning: e.target.value })} />
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <input type="text" placeholder="例句" className="input-field" value={newWord.example} onChange={e => setNewWord({ ...newWord, example: e.target.value })} style={{ width: '100%' }} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}><Plus size={18} /> 添加</button>
                                </form>
                            ) : (
                                <div>
                                    <textarea
                                        className="input-field"
                                        rows="6"
                                        placeholder={`格式示例：\napple [ˈæpl] 苹果\nbanana [bəˈnɑːnə] 香蕉\n(每行一个单词，支持自动识别 [音标])`}
                                        value={newWord.batchContent || ''}
                                        onChange={e => setNewWord({ ...newWord, batchContent: e.target.value })}
                                        style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1rem' }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            if (!newWord.batchContent) return;
                                            const lines = newWord.batchContent.split('\n').filter(l => l.trim());
                                            const wordsToCreate = lines.map(line => {
                                                const parts = line.trim().split(/\s+/);
                                                let word = parts[0];
                                                let phonetic = '';
                                                let meaning = '';

                                                const rest = parts.slice(1).join(' ');
                                                const phoneticMatch = rest.match(/\[(.*?)\]/);

                                                if (phoneticMatch) {
                                                    phonetic = `[${phoneticMatch[1]}]`;
                                                    meaning = rest.replace(phonetic, '').trim();
                                                } else {
                                                    meaning = rest;
                                                }
                                                return { word, phonetic, meaning };
                                            });

                                            if (wordsToCreate.length === 0) return;

                                            try {
                                                const token = localStorage.getItem('token'); // Simplification: using direct fetch here or update context
                                                const res = await fetch('/api/words', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                                    body: JSON.stringify(wordsToCreate)
                                                });
                                                if (res.ok) {
                                                    alert(`成功添加 ${wordsToCreate.length} 个单词`);
                                                    setNewWord({ ...newWord, batchContent: '' });
                                                    // Trigger refresh if context allows, or simple window reload for now
                                                    window.location.reload();
                                                }
                                            } catch (e) { console.error(e); alert('添加失败'); }
                                        }}
                                    >
                                        <Plus size={18} /> 确认批量添加
                                    </button>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {words.map(item => (
                                <div key={item.id} className="card hover-scale" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{item.word}</span>
                                        <span style={{ margin: '0 0.5rem', color: 'var(--text-light)', fontFamily: 'serif' }}>{item.phonetic}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.meaning}</span>
                                    </div>
                                    <button onClick={() => deleteWord(item.id)} className="btn-icon" style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'sentences' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>录入新句子</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className={`btn ${!newSentence.isBatch ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setNewSentence({ ...newSentence, isBatch: false })}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >单条录入</button>
                                    <button
                                        className={`btn ${newSentence.isBatch ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setNewSentence({ ...newSentence, isBatch: true })}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >批量录入</button>
                                </div>
                            </div>

                            {!newSentence.isBatch ? (
                                <form onSubmit={handleAddSentence} style={{ display: 'grid', gap: '1rem' }}>
                                    <input type="text" placeholder="英文句子" className="input-field" value={newSentence.text} onChange={e => setNewSentence({ ...newSentence, text: e.target.value })} required />
                                    <input type="text" placeholder="中文翻译" className="input-field" value={newSentence.translation} onChange={e => setNewSentence({ ...newSentence, translation: e.target.value })} required />
                                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}><Plus size={18} /> 添加</button>
                                </form>
                            ) : (
                                <div>
                                    <textarea
                                        className="input-field"
                                        rows="6"
                                        placeholder={`格式示例：\nHello World | 您好世界\nThis is a pen. | 这是一支笔。\n(每行一句，使用 | 分隔英文和中文)`}
                                        value={newSentence.batchContent || ''}
                                        onChange={e => setNewSentence({ ...newSentence, batchContent: e.target.value })}
                                        style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1rem' }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            if (!newSentence.batchContent) return;
                                            const lines = newSentence.batchContent.split('\n').filter(l => l.trim());
                                            const itemsToCreate = lines.map(line => {
                                                // Split by pipe | or tab or Chinese space? Let's use | as suggested in placeholder
                                                const parts = line.split(/[|｜]/);
                                                let text = parts[0].trim();
                                                let translation = parts[1] ? parts[1].trim() : '';
                                                return { text, translation };
                                            });

                                            if (itemsToCreate.length === 0) return;

                                            try {
                                                const token = localStorage.getItem('token');
                                                const res = await fetch('/api/sentences', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                                    body: JSON.stringify(itemsToCreate)
                                                });
                                                if (res.ok) {
                                                    alert(`成功添加 ${itemsToCreate.length} 个句子`);
                                                    setNewSentence({ ...newSentence, batchContent: '' });
                                                    window.location.reload();
                                                }
                                            } catch (e) { console.error(e); alert('添加失败'); }
                                        }}
                                    >
                                        <Plus size={18} /> 确认批量添加
                                    </button>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {sentences.map(item => (
                                <div key={item.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.text}</div>
                                        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{item.translation}</div>
                                    </div>
                                    <button onClick={() => deleteSentence(item.id)} className="btn-icon" style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>发布新作业</h3>
                            <form onSubmit={handleCreateHomework}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="作业标题 (例如: Unit 1 单词测试)"
                                        className="input-field"
                                        value={newHomework.title}
                                        onChange={e => setNewHomework({ ...newHomework, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={newHomework.deadline}
                                        onChange={e => setNewHomework({ ...newHomework, deadline: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--surface-200)', borderRadius: '8px', padding: '1rem' }}>
                                    <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>选择单词内容 ({selectedItems.length})</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
                                        {words.map(word => (
                                            <div
                                                key={word.id}
                                                onClick={() => toggleSelection(word.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    border: selectedItems.includes(word.id) ? '2px solid var(--primary-500)' : '1px solid var(--surface-200)',
                                                    background: selectedItems.includes(word.id) ? 'var(--primary-50)' : 'white',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <div style={{ fontWeight: 'bold' }}>{word.word}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{word.meaning}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={selectedItems.length === 0}>
                                    <Plus size={18} /> 发布作业
                                </button>
                            </form>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>已发布的作业</h3>
                            {homeworks.map(hw => (
                                <div key={hw.id} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{hw.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                截止: {hw.deadline ? new Date(hw.deadline).toLocaleDateString() : '无期限'} |
                                                完成度: {hw.records.filter(r => r.status === 'COMPLETED').length} / {hw.records.length} 人
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-100)', paddingTop: '1rem' }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>学生完成情况</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {hw.records.map(record => (
                                                <span key={record.id} style={{
                                                    fontSize: '0.8rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '99px',
                                                    background: record.status === 'COMPLETED' ? '#dcfce7' : '#f1f5f9',
                                                    color: record.status === 'COMPLETED' ? '#166534' : '#64748b',
                                                    border: '1px solid transparent'
                                                }}>
                                                    {record.student.name}: {record.status === 'COMPLETED' ? `${record.score}分` : '未完成'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'students' && (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>我的学生 ({students.length})</h3>
                            {students.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                                    暂无学生加入。请分享您的代码给学生：<span style={{ fontWeight: 'bold', color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{user.teacherCode || '...'}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {students.map(student => (
                                        <div key={student.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 40, height: 40, background: 'var(--primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{student.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>@{student.username}</div>
                                                </div>
                                            </div>
                                            {/* Future: Add 'View Progress' button */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherPage;
