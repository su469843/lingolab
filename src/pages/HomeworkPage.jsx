import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WordsPractice from '../components/WordsPractice'; // Reusing practice component logic if possible, or build simple version

const HomeworkPage = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHomework, setActiveHomework] = useState(null); // The homework currently being done

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/homework', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                setAssignments(await res.json());
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleComplete = async (score) => {
        if (!activeHomework) return;
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/homework/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ recordId: activeHomework.id, score })
            });
            alert('作业已提交！');
            setActiveHomework(null);
            fetchAssignments(); // Refresh
        } catch (error) {
            console.error(error);
            alert('提交失败');
        }
    };

    // simplified practice wrapper
    const HomeworkPractice = ({ homework, onComplete }) => {
        const [items, setItems] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [score, setScore] = useState(0);
        const [showResult, setShowResult] = useState(false);
        const [userInput, setUserInput] = useState('');
        const [feedback, setFeedback] = useState(null);

        useEffect(() => {
            // Need to fetch the actual content details (words) based on IDs
            // For now, assume we fetch all words and filter. In production, need specific endpoint.
            const loadContent = async () => {
                const ids = JSON.parse(homework.homework.contentIds);
                const res = await fetch('/api/words'); // Ideally optimize this
                const allWords = await res.json();
                const homeworkWords = allWords.filter(w => ids.includes(w.id));
                // Shuffle
                setItems(homeworkWords.sort(() => 0.5 - Math.random()));
            };
            loadContent();
        }, [homework]);

        const handleSubmit = (e) => {
            e.preventDefault();
            const currentItem = items[currentIndex];
            if (userInput.trim().toLowerCase() === currentItem.word.toLowerCase()) {
                setFeedback('correct');
                setScore(s => s + 1);
                setTimeout(nextItem, 1000);
            } else {
                setFeedback('incorrect');
                setTimeout(nextItem, 2000); // Give time to see correct answer if we showed it
            }
        };

        const nextItem = () => {
            setUserInput('');
            setFeedback(null);
            if (currentIndex + 1 >= items.length) {
                setShowResult(true);
                // Calculate percentage
                // onComplete(score + (feedback === 'correct' ? 1 : 0)); // risky due to closure
                // let's pass final score
            } else {
                setCurrentIndex(c => c + 1);
            }
        };

        if (items.length === 0) return <div>加载题目中...</div>;

        if (showResult) {
            return (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <h2>作业完成!</h2>
                    <p style={{ fontSize: '2rem', margin: '1rem 0', color: 'var(--primary-600)' }}>
                        得分: {score} / {items.length}
                    </p>
                    <button className="btn btn-primary" onClick={() => onComplete(Math.round((score / items.length) * 100))}>
                        提交成绩
                    </button>
                </div>
            );
        }

        const currentItem = items[currentIndex];

        return (
            <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span>Progress: {currentIndex + 1} / {items.length}</span>
                    <span>Score: {score}</span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{currentItem.meaning}</div>
                    <div style={{ color: 'var(--text-light)' }}>{currentItem.phonetic}</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        autoFocus
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        placeholder="输入单词..."
                        style={{ textAlign: 'center', fontSize: '1.2rem', borderColor: feedback === 'correct' ? '#22c55e' : feedback === 'incorrect' ? '#ef4444' : '' }}
                        disabled={feedback !== null}
                    />
                    {feedback === 'incorrect' && (
                        <div style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>
                            正确答案: <strong>{currentItem.word}</strong>
                        </div>
                    )}
                </form>
            </div>
        );
    };

    if (activeHomework) {
        return <HomeworkPractice homework={activeHomework} onComplete={handleComplete} />;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ClipboardList /> 我的作业
            </h1>

            {assignments.length === 0 && !loading ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    暂无作业
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {assignments.map(assign => (
                        <div key={assign.id} className="card hover-scale" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{assign.homework.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={16} /> 截止: {assign.homework.deadline ? new Date(assign.homework.deadline).toLocaleDateString() : '无期限'}
                                    </span>
                                    <span className={assign.status === 'COMPLETED' ? 'text-green' : 'text-orange'}>
                                        {assign.status === 'COMPLETED' ? '已完成' : '待完成'}
                                    </span>
                                </div>
                            </div>

                            {assign.status === 'PENDING' ? (
                                <button className="btn btn-primary" onClick={() => setActiveHomework(assign)}>
                                    <PlayCircle size={18} /> 开始作业
                                </button>
                            ) : (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-600)' }}>{assign.score}分</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(assign.completedAt).toLocaleDateString()}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeworkPage;
