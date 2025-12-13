import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClipboardList, CheckCircle, PlayCircle, Clock, ArrowRight } from 'lucide-react';
import Flashcard from '../components/Flashcard';

const HomeworkPage = () => {
    // const { user } = useAuth();
    const { words, sentences } = useData();
    const [records, setRecords] = useState([]);

    // Study Mode State
    const [activeRecord, setActiveRecord] = useState(null); // The homework record currently being studied
    const [studyItems, setStudyItems] = useState([]); // Array of actual Word/Sentence objects
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [isQuiz, setIsQuiz] = useState(false); // If true, in quiz phase
    // const [score, setScore] = useState(0); // Unused currently

    const fetchRecords = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/homework/student', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                setRecords(await res.json());
            }
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchRecords();
        })();
    }, [fetchRecords]);

    const startHomework = (record) => {
        const ids = JSON.parse(record.homework.contentIds);
        let items = [];
        if (record.homework.type === 'WORD') {
            items = words.filter(w => ids.includes(w.id));
        } else {
            items = sentences.filter(s => ids.includes(s.id));
        }

        if (items.length === 0) {
            alert('找不到作业内容 (可能已被删除)');
            return;
        }

        setStudyItems(items);
        setActiveRecord(record);
        setCurrentIndex(0);
        // setIsQuiz(false);
        setCurrentIndex(0);
        // setIsQuiz(false);
        // setScore(0);
    };

    const handleNext = () => {
        if (currentIndex < studyItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Finished learning, start quiz or just submit if simple
            // For now, let's just complete it after viewing all
            submitHomework(100);
        }
    };

    const submitHomework = async (finalScore) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/homework/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ recordId: activeRecord.id, score: finalScore })
            });
            alert('作业已提交!');
            setActiveRecord(null);
            fetchRecords();
        } catch (error) { console.error(error); }
    };

    // RENDER: Study Mode
    if (activeRecord) {
        const currentItem = studyItems[currentIndex];
        const isWord = activeRecord.homework.type === 'WORD';
        // const progress = Math.round(((currentIndex + 1) / studyItems.length) * 100);

        return (
            <div className="page-container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setActiveRecord(null)} className="btn btn-secondary">退出</button>
                    <div>正在做: {activeRecord.homework.title} ({currentIndex + 1}/{studyItems.length})</div>
                </div>

                {isWord && <Flashcard word={currentItem} onResult={() => { }} />}
                {!isWord && (
                    <div className="card" style={{ padding: '2rem', fontSize: '1.2rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{currentItem.text}</div>
                        <div style={{ color: 'var(--text-medium)' }}>{currentItem.translation}</div>
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNext}>
                        {currentIndex < studyItems.length - 1 ? '下一个' : '完成并提交'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </div>
            </div>
        )
    }

    // RENDER: List Mode
    const pending = records.filter(r => r.status === 'PENDING');
    const completed = records.filter(r => r.status === 'COMPLETED');

    return (
        <div className="page-container">
            <h2 className="page-title">我的作业中心</h2>

            <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#d97706' }}>待完成 ({pending.length})</h3>
                {pending.length === 0 ? <div style={{ color: 'var(--text-light)' }}>暂无待写作业</div> : (
                    <div className="list-container">
                        {pending.map(r => (
                            <div key={r.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{r.homework.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        截止: {r.homework.deadline ? new Date(r.homework.deadline).toLocaleDateString() : '无期限'}
                                        <span style={{ marginLeft: '1rem', padding: '2px 6px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', fontSize: '0.8rem' }}>{r.homework.type === 'WORD' ? '单词' : '句子'}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={() => startHomework(r)}>
                                    <PlayCircle size={18} style={{ marginRight: '0.5rem' }} /> 开始
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#059669' }}>已完成 ({completed.length})</h3>
                {completed.length === 0 ? <div style={{ color: 'var(--text-light)' }}>暂无已完成作业</div> : (
                    <div className="list-container">
                        {completed.map(r => (
                            <div key={r.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', background: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{r.homework.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                        Completed: {new Date(r.completedAt).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ color: '#059669', display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle size={20} style={{ marginRight: '0.5rem' }} /> 已提交
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomeworkPage;
