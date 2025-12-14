import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RefreshCw, CheckCircle2, XCircle, ArrowRight, Play, Trophy } from 'lucide-react';

import { playTTS } from '../lib/tts';

const PhoneticPractice = ({ items }) => {
    const [stage, setStage] = useState('intro'); // intro, quiz, result
    const [group, setGroup] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'

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
    }, [group, currentQuestionIndex]);

    // Initialize a new group of 5
    const startNewGroup = React.useCallback(() => {
        // Fisher-Yates Shuffle
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const selected = shuffled.slice(0, 5);
        setGroup(selected);
        setStage('intro');
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedback(null);
    }, [items]);

    useEffect(() => {
        // Initial load
        if (group.length === 0) startNewGroup();
    }, [items, group.length, startNewGroup]);

    const playSound = async (symbol, examples) => {
        const exampleWord = examples.split(',')[0];

        // 1. Play Symbol
        try {
            await playTTS(symbol);
        } catch (e) { console.warn('TTS Symbol failed', e); }

        // 2. Pause 0.2s
        await new Promise(r => setTimeout(r, 200));

        // 3. Play Word
        try {
            await playTTS(exampleWord);
        } catch (e) { console.warn('TTS Word failed', e); }
    };

    const startQuiz = () => {
        setStage('quiz');
        setTimeout(() => {
            if (group[0]) playSound(group[0].symbol, group[0].examples);
        }, 500);
    };

    const handleAnswer = (selectedItem) => {
        if (feedback) return;

        const target = group[currentQuestionIndex];
        if (selectedItem.symbol === target.symbol) {
            setFeedback('correct');
            setScore(s => s + 1);

            // Stats Update
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    fetch('/api/stats/record', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ type: 'phonetic', count: 1 })
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
                setTimeout(() => {
                    const next = group[currentQuestionIndex + 1];
                    playSound(next.symbol, next.examples);
                }, 500);
            } else {
                setStage('result');
            }
        }, 1500);
    };

    const replayCurrent = () => {
        const target = group[currentQuestionIndex];
        playSound(target.symbol, target.examples);
    };

    if (stage === 'intro') {
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>本组目标音标</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>先熟悉这 5 个音标，准备好后开始测试</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                    {group.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '1rem 0.5rem',
                                border: '1px solid var(--surface-100)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="hover-card"
                            onClick={() => playSound(item.symbol, item.examples)}
                        >
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.25rem' }}>{item.symbol}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.examples.split(',')[0]}</div>
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary" onClick={startQuiz} style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
                    开始听音测试 <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    if (stage === 'quiz') {
        const progress = ((currentQuestionIndex) / group.length) * 100;

        return (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <span>问题 {currentQuestionIndex + 1} / {group.length}</span>
                    <span>得分: {score}</span>
                </div>

                <div style={{ height: '6px', background: 'var(--surface-100)', borderRadius: '99px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-500)', transition: 'width 0.3s ease' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div
                        onClick={replayCurrent}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'var(--primary-50)',
                            color: 'var(--primary-600)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            cursor: 'pointer',
                            border: '4px solid white',
                            boxShadow: '0 0 0 4px var(--primary-100), 0 10px 20px rgba(99,102,241,0.2)'
                        }}
                        className="btn-pulse"
                    >
                        <Volume2 size={40} />
                        <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>重播</span>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>点击按钮重听发音，选择对应的音标</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                    {currentOptions.map((item, idx) => {
                        const isCorrect = feedback && item.symbol === group[currentQuestionIndex].symbol;
                        // const isWrong = feedback === 'incorrect' && item.symbol !== group[currentQuestionIndex].symbol;

                        return (
                            <button
                                key={idx}
                                className="btn"
                                style={{
                                    height: '80px',
                                    padding: 0,
                                    fontSize: '1.75rem',
                                    background: isCorrect ? '#dcfce7' : (feedback && 'white'),
                                    borderColor: isCorrect ? '#22c55e' : 'var(--surface-100)',
                                    color: isCorrect ? '#166534' : 'var(--text-main)',
                                    border: `2px solid ${isCorrect ? '#22c55e' : 'var(--surface-100)'}`,
                                    opacity: feedback && !isCorrect ? 0.5 : 1
                                }}
                                onClick={() => handleAnswer(item)}
                                disabled={!!feedback}
                            >
                                {item.symbol}
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
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        {feedback === 'correct' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                    </div>
                )}
            </div>
        );
    }

    // Result Stage
    return (
        <div className="card animate-fade-in" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: score === group.length ? '#fef08a' : 'var(--primary-100)',
                color: score === group.length ? '#854d0e' : 'var(--primary-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 2rem'
            }}>
                <Trophy size={48} />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>练习完成!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                您答对了 <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{score}</span> / {group.length} 题
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={startNewGroup} style={{ flex: 1 }}>
                    <RefreshCw size={18} /> 换一组
                </button>
                <button className="btn btn-primary" onClick={() => { setStage('intro'); setCurrentQuestionIndex(0); setScore(0); setFeedback(null); }} style={{ flex: 1 }}>
                    <Play size={18} /> 再练一次
                </button>
            </div>
        </div>
    );
};

export default PhoneticPractice;
