<<<<<<< HEAD
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save } from 'lucide-react';

const TeacherPage = () => {
    const { words, sentences, addWord, deleteWord, addSentence, deleteSentence } = useData();
    const [activeTab, setActiveTab] = useState('words');
=======
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Users, User } from 'lucide-react';

const TeacherPage = () => {
    const { words, sentences, addWord, deleteWord, addSentence, deleteSentence } = useData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('words');
    const [students, setStudents] = useState([]);

    // Homework State
    const [homeworks, setHomeworks] = useState([]);
    const [newHomework, setNewHomework] = useState({ title: '', type: 'WORD', contentIds: [], deadline: '' });
    const [selectedItems, setSelectedItems] = useState([]);
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)

    // Forms State
    const [newWord, setNewWord] = useState({ word: '', phonetic: '', meaning: '', example: '' });
    const [newSentence, setNewSentence] = useState({ text: '', translation: '' });

<<<<<<< HEAD
=======
    // Textbook State
    const [textbooks, setTextbooks] = useState([]);
    const [newTextbook, setNewTextbook] = useState({ title: '', description: '' });
    const [batchText, setBatchText] = useState('');
    const [expandedBookId, setExpandedBookId] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            /* ... existing fetchStudents logic ... */
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setStudents(data.students || []);
                }
            } catch (error) { console.error(error); }
        };

        const fetchHomeworks = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/homework', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setHomeworks(await res.json());
            } catch (error) { console.error(error); }
        };

        const fetchTextbooks = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/textbooks', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setTextbooks(await res.json());
            } catch (error) { console.error(error); }
        };

        if (activeTab === 'students' && user) fetchStudents();
        if (activeTab === 'homework' && user) fetchHomeworks();
        if (activeTab === 'textbooks' && user) fetchTextbooks();
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
                const booksRes = await fetch('/api/textbooks', { headers: { Authorization: `Bearer ${token}` } });
                if (booksRes.ok) setTextbooks(await booksRes.json());
            }
        } catch (error) { console.error(error); }
    };

    const handleBatchAddWords = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/textbooks/batch?id=${bookId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ text: batchText })
            });
            if (res.ok) {
                const data = await res.json();
                alert(`成功添加 ${data.count} 个单词!`);
                setBatchText('');
                setExpandedBookId(null);
                const booksRes = await fetch('/api/textbooks', { headers: { Authorization: `Bearer ${token}` } });
                if (booksRes.ok) setTextbooks(await booksRes.json());
            }
        } catch (error) { console.error(error); }
    };

    const handleCreateHomework = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/homework', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...newHomework,
                    contentIds: selectedItems // Array of IDs
                })
            });
            if (res.ok) {
                alert('作业布置成功!');
                setNewHomework({ title: '', type: 'WORD', contentIds: [], deadline: '' });
                setSelectedItems([]);
                // Manually trigger refresh logic or just set state if we returned it. 
                // Simplest is to just re-fetch here inline or extract function properly.
                // Let's re-fetch inline for now to fix the scope issue quickly.
                const token = localStorage.getItem('token');
                fetch('/api/homework', { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => res.json())
                    .then(data => setHomeworks(data))
                    .catch(err => console.error(err));
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

>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
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
<<<<<<< HEAD
            </div>

=======
                <button
                    className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('students')}
                >
                    我的学生 ({students.length})
                </button>
                <button
                    className={`btn ${activeTab === 'homework' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('homework')}
                >
                    作业管理
                </button>
                <button
                    className={`btn ${activeTab === 'textbooks' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('textbooks')}
                >
                    教材管理
                </button>
            </div>

            {activeTab === 'textbooks' && (
                <div className="dashboard-section">
                    {/* Add Textbook Form */}
                    <div className="card form-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>创建新教材</h3>
                        <form onSubmit={handleCreateTextbook} style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text" placeholder="教材名称 (e.g. Grade 1 Unit 1)" className="input-field"
                                value={newTextbook.title} onChange={e => setNewTextbook({ ...newTextbook, title: e.target.value })}
                                required style={inputStyle}
                            />
                            <input
                                type="text" placeholder="描述 (可选)" className="input-field"
                                value={newTextbook.description} onChange={e => setNewTextbook({ ...newTextbook, description: e.target.value })}
                                style={inputStyle}
                            />
                            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> 创建教材
                            </button>
                        </form>
                    </div>

                    {/* Textbook List */}
                    <div className="list-container">
                        {textbooks.map(book => (
                            <div key={book.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{book.title}</div>
                                        <div style={{ color: 'var(--text-medium)' }}>{book.description}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                            包含单词数: {book._count?.words || 0}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setExpandedBookId(expandedBookId === book.id ? null : book.id)}
                                    >
                                        {expandedBookId === book.id ? '收起' : '批量添加单词'}
                                    </button>
                                </div>

                                {expandedBookId === book.id && (
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                                            直接粘贴文本，系统将自动识别单词和释义。每行一个。<br />
                                            格式支持: <code>Word [Phonetic] Meaning</code> 或 <code>Word Meaning</code>
                                        </div>
                                        <textarea
                                            className="input-field"
                                            rows="6"
                                            placeholder={"Example:\napple [ˈæpl] 苹果\nbanana 香蕉 / Example sentence..."}
                                            value={batchText}
                                            onChange={e => setBatchText(e.target.value)}
                                            style={{ ...inputStyle, fontFamily: 'monospace' }}
                                        />
                                        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleBatchAddWords(book.id)}
                                                disabled={!batchText.trim()}
                                            >
                                                确认批量添加
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
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
<<<<<<< HEAD
=======

            {activeTab === 'homework' && (
                <div className="dashboard-section">
                    <div className="card form-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>布置新作业</h3>
                        <form onSubmit={handleCreateHomework} style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text" placeholder="作业标题" className="input-field"
                                value={newHomework.title} onChange={e => setNewHomework({ ...newHomework, title: e.target.value })}
                                required style={inputStyle}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    className="input-field"
                                    value={newHomework.type}
                                    onChange={e => { setNewHomework({ ...newHomework, type: e.target.value }); setSelectedItems([]); }}
                                    style={inputStyle}
                                >
                                    <option value="WORD">单词作业</option>
                                    <option value="SENTENCE">句子作业</option>
                                </select>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={newHomework.deadline} onChange={e => setNewHomework({ ...newHomework, deadline: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Selection Area */}
                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', position: 'sticky', top: 0, background: 'white' }}>请选择内容 (已选: {selectedItems.length})</div>
                                {newHomework.type === 'WORD' ? words.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <span>{item.word} ({item.meaning})</span>
                                    </div>
                                )) : sentences.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={selectedItems.length === 0}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> 发布作业
                            </button>
                        </form>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>历史作业</h3>
                    <div className="list-container">
                        {homeworks.map(hw => (
                            <div key={hw.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 'bold' }}>{hw.title} <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'normal' }}>({hw.type})</span></div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{new Date(hw.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    完成情况: {hw.records.filter(r => r.status === 'COMPLETED').length} / {hw.records.length}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="dashboard-section">
                    <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>我的学生列表</h3>
                        {students.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                                暂无学生关联。告知学生在注册时填写您的 ID: {user.id}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {students.map(student => (
                                    <div key={student.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem' }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{student.name || student.username}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>@{student.username}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
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
