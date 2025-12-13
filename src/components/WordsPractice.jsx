import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCw, CheckCircle, XCircle, ArrowRight, Layers } from 'lucide-react';

const WordsPractice = ({ words }) => {
    const [stage, setStage] = useState('intro'); // intro, quiz, result
    const [group, setGroup] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [quizType, setQuizType] = useState('meaning'); // 'meaning' or 'phonetic'

    // Initialize a new group of 5
    const startNewGroup = React.useCallback(() => {
        if (!words || words.length === 0) return;
        const count = Math.min(5, words.length);
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        setGroup(selected);
        setStage('intro');
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedback(null);
    }, [words]);

    useEffect(() => {
        const timer = setTimeout(() => {
            startNewGroup();
        }, 0);
        return () => clearTimeout(timer);
    }, [startNewGroup]);

    const playSound = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const startQuiz = () => {
        setStage('quiz');
        // Randomize quiz type per session or per question?
        // Let's mix: For each word, randomly ask either phonetic or meaning
        setTimeout(() => {
            playSound(group[0].word);
        }, 500);
    };

    const handleAnswer = (selectedItem) => {
        if (feedback) return;

        const target = group[currentQuestionIndex];
        if (selectedItem.id === target.id) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            if (currentQuestionIndex < group.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setFeedback(null);
                // Toggle quiz type randomly for variety
                setQuizType(Math.random() > 0.5 ? 'meaning' : 'phonetic');

                // Play next sound
                setTimeout(() => {
                    playSound(group[currentQuestionIndex + 1].word);
                }, 500);
            } else {
                setStage('result');
            }
        }, 1500);
    };

    if (!words || words.length === 0) {
        return <div className="practice-container">请先在"教师后台"添加单词。</div>;
    }

    if (stage === 'intro') {
        return (
            <div className="practice-container">
                <h2>单词突击 ({group.length}个)</h2>
                <p className="subtitle">先熟悉这组单词</p>

                <div className="options-grid" style={{ marginBottom: '2rem' }}>
                    {group.map((item, idx) => (
                        <div key={idx} className="phonetic-card" onClick={() => playSound(item.word)}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.word}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{item.phonetic}</div>
                            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{item.meaning}</div>
                            <Volume2 size={16} className="icon-small" />
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary btn-large" onClick={startQuiz}>
                    开始测试 <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    if (stage === 'quiz') {
        const progress = ((currentQuestionIndex) / group.length) * 100;
        const currentType = quizType; // or derived from state if we want to track it per question explicitly

        return (
            <div className="practice-container">
                <div className="quiz-header">
                    <span>进度: {currentQuestionIndex + 1} / {group.length}</span>
                    <div className="progress-bar"><div style={{ width: `${progress}%` }}></div></div>
                </div>

                <div className="question-area">
                    <h3>听音选{currentType === 'meaning' ? '义' : '标'}</h3>
                    <button className="btn-icon-large pulse" onClick={() => playSound(group[currentQuestionIndex].word)}>
                        <Volume2 size={48} />
                        <div>重播</div>
                    </button>
                </div>

                <div className="options-grid">
                    {group.map((item, idx) => (
                        <button
                            key={idx}
                            className={`option-card ${feedback && item.id === group[currentQuestionIndex].id ? 'correct' : ''} ${feedback === 'incorrect' && item === group[currentQuestionIndex] ? 'wrong' : ''}`}
                            onClick={() => handleAnswer(item)}
                            disabled={!!feedback}
                            style={{ padding: '1rem', display: 'flex', flexDirection: 'column', fontSize: currentType === 'meaning' ? '1rem' : '1.25rem' }}
                        >
                            {currentType === 'meaning' ? (
                                <div>{item.meaning}</div>
                            ) : (
                                <div style={{ fontFamily: 'monospace' }}>{item.phonetic || 'N/A'}</div>
                            )}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`feedback-toast ${feedback}`}>
                        {feedback === 'correct' ? <CheckCircle /> : <XCircle />}
                        {feedback === 'correct' ? '回答正确!' : '回答错误'}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="practice-container result-view">
            <div className="score-circle">
                <div className="score-number">{Math.round((score / group.length) * 100)}</div>
                <div className="score-label">分</div>
            </div>
            <h3>本组练习完成!</h3>
            <p>答对 {score} / {group.length}</p>

            <div className="action-buttons">
                <button className="btn btn-secondary" onClick={startNewGroup}>
                    <RefreshCw size={20} /> 下一组
                </button>
                <button className="btn btn-primary" onClick={() => { setStage('intro'); setCurrentQuestionIndex(0); setScore(0); setFeedback(null); }}>
                    再练一次
                </button>
            </div>
        </div>
    );
};

export default WordsPractice;
