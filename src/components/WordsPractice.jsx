import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RefreshCw, CheckCircle2, XCircle, ArrowRight, BookOpen, Clock, Play } from 'lucide-react';

import { playTTS } from '../lib/tts';

const WordsPractice = ({ words }) => {
    const [stage, setStage] = useState('intro'); // intro, quiz, result
    const [group, setGroup] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [quizType, setQuizType] = useState('meaning'); // 'meaning' or 'phonetic'

    // Shuffle options for the current question
    const currentOptions = useMemo(() => {
        if (group.length === 0) return [];
        // Create a copy and shuffle it
        const options = [...group];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }, [group, currentQuestionIndex]); // Re-shuffle when question changes

    // Initialize a new group of 5
    const startNewGroup = React.useCallback(() => {
        if (!words || words.length === 0) return;

        // Fisher-Yates Shuffle
        const shuffled = [...words];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const count = Math.min(5, words.length);
        const selected = shuffled.slice(0, count);
        setGroup(selected);
        setStage('intro');
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedback(null);
    }, [words]);

    useEffect(() => {
        if (group.length === 0) startNewGroup();
    }, [words, startNewGroup, group.length]);

    const playSound = (text) => {
        playTTS(text);
    };

    const startQuiz = () => {
        setStage('quiz');
        setQuizType(Math.random() > 0.5 ? 'meaning' : 'phonetic');
        setTimeout(() => {
            if (group[0]) playSound(group[0].word);
        }, 500);
    };

    const handleAnswer = (selectedItem) => {
        if (feedback) return;

        const target = group[currentQuestionIndex];
        if (selectedItem.id === target.id) {
            setFeedback('correct');
            setScore(s => s + 1);

            // Stats Update
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    fetch('/api/stats/record', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ type: 'word', count: 1 })
                    });
                }
            } catch (e) { console.error('Stats error', e); }

        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            if (currentQuestionIndex < group.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setFeedback(null);
                setQuizType(Math.random() > 0.5 ? 'meaning' : 'phonetic'); // Mix it up
                setTimeout(() => {
                    const next = group[currentQuestionIndex + 1];
                    playSound(next.word);
                }, 500);
            } else {
                setStage('result');
            }
        }, 1500);
    };

    if (!words || words.length === 0) {
        return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>请先添加单词。</div>;
    }

    if (stage === 'intro') {
        return (
            <div className="card animate-fade-in" style={{ padding: '3rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: 64, height: 64, background: 'var(--secondary-50)', color: 'var(--secondary-500)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <BookOpen size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>本组挑战 ({group.length}词)</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>快速浏览，准备冲刺</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                    {group.map((item, idx) => (
                        <div key={idx} className="hover-card" onClick={() => playSound(item.word)} style={{
                            padding: '1rem',
                            border: '1px solid var(--surface-100)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.word}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>{item.phonetic}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.meaning}</div>
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary" onClick={startQuiz} style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
                    开始挑战 <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    if (stage === 'quiz') {
        const progress = ((currentQuestionIndex) / group.length) * 100;
        const currentType = quizType;

        return (
            <div className="card animate-fade-in" style={{ padding: '3rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} /> 题目 {currentQuestionIndex + 1}
                    </div>
                    <span>{currentQuestionIndex + 1} / {group.length}</span>
                </div>

                <div style={{ height: '6px', background: 'var(--surface-100)', borderRadius: '99px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--secondary-500)', transition: 'width 0.3s ease' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <button
                        onClick={() => playSound(group[currentQuestionIndex].word)}
                        className="btn-pulse"
                        style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: 'white', border: '4px solid var(--secondary-500)',
                            color: 'var(--secondary-500)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto', fontSize: '0.8rem', fontWeight: 600,
                            boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)'
                        }}
                    >
                        <Volume2 size={32} />
                        <span style={{ marginTop: '0.25rem' }}>听词</span>
                    </button>
                    <h3 style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
                        请选出正确的{currentType === 'meaning' ? '含义' : '音标'}
                    </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {currentOptions.map((item, idx) => {
                        const isCorrect = feedback && item.id === group[currentQuestionIndex].id;
                        const isWrong = feedback === 'incorrect' && item.id !== group[currentQuestionIndex].id && false; // Don't highlight wrongs? Or highlight selected wrong? 
                        // Let's rely on button click state if we could, but here we just show Correct one clearly.

                        return (
                            <button
                                key={idx}
                                className="btn"
                                style={{
                                    textAlign: 'left',
                                    padding: '1.25rem',
                                    fontSize: '1.1rem',
                                    background: isCorrect ? '#f0fdf4' : (feedback ? 'white' : 'var(--surface-50)'),
                                    borderColor: isCorrect ? '#22c55e' : 'transparent',
                                    color: isCorrect ? '#15803d' : 'var(--text-main)',
                                    border: `2px solid ${isCorrect ? '#22c55e' : 'transparent'}`,
                                    opacity: feedback && !isCorrect ? 0.6 : 1,
                                    justifyContent: 'flex-start'
                                }}
                                onClick={() => handleAnswer(item)}
                                disabled={!!feedback}
                            >
                                <span style={{ width: '2rem', height: '2rem', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-light)', marginRight: '1rem', border: '1px solid var(--surface-100)' }}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {currentType === 'meaning' ? item.meaning : item.phonetic}
                            </button>
                        );
                    })}
                </div>

                {feedback && (
                    <div className="animate-slide-up" style={{
                        position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                        background: feedback === 'correct' ? '#22c55e' : '#ef4444',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        zIndex: 100
                    }}>
                        {feedback === 'correct' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                    </div>
                )}
            </div>
        );
    }

    // Result view
    return (
        <div className="card animate-scale-up" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: score === group.length ? '#fef08a' : 'var(--secondary-50)',
                color: score === group.length ? '#854d0e' : 'var(--secondary-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 2rem'
            }}>
                <CheckCircle2 size={64} />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{score === group.length ? '完美!' : '完成!'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                本次得分 <span style={{ fontWeight: 800, color: 'var(--secondary-600)' }}>{score}</span> / {group.length}
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={startNewGroup} style={{ flex: 1, padding: '1rem' }}>
                    <RefreshCw size={20} /> 下一组
                </button>
                <button className="btn btn-primary" onClick={() => { setStage('intro'); setCurrentQuestionIndex(0); setScore(0); setFeedback(null); }} style={{ flex: 1, padding: '1rem' }}>
                    <Play size={20} /> 再练一次
                </button>
            </div>
        </div>
    );
};

export default WordsPractice;
