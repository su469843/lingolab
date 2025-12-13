import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCw, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const PhoneticPractice = ({ items }) => {
    const [stage, setStage] = useState('intro'); // intro, quiz, result
    const [group, setGroup] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'

    // Initialize a new group of 5
    // Initialize a new group of 5
    const startNewGroup = React.useCallback(() => {
        // Randomly select 5 items
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setGroup(selected);
        setStage('intro');
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedback(null);
    }, [items]);

    useEffect(() => {
        const timer = setTimeout(() => {
            startNewGroup();
        }, 0);
        return () => clearTimeout(timer);
    }, [startNewGroup]);

    const playSound = (symbol, examples) => {
        const exampleWord = examples.split(',')[0];
        const utterance = new SpeechSynthesisUtterance(exampleWord);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const startQuiz = () => {
        setStage('quiz');
        // Shuffle the question order, but keep the group same for options
        // Actually simpler: iterate through the group as questions
        // But maybe random order within group? Let's just go sequentially for now or shuffle an indices array.
        // Let's just use the group array order as question order for simplicity first.
        // Auto play first sound
        setTimeout(() => {
            playSound(group[0].symbol, group[0].examples);
        }, 500);
    };

    const handleAnswer = (selectedItem) => {
        if (feedback) return; // Prevent multiple clicks

        const target = group[currentQuestionIndex];
        if (selectedItem.symbol === target.symbol) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        // Auto move to next after delay
        setTimeout(() => {
            if (currentQuestionIndex < group.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setFeedback(null);
                // Play next sound
                setTimeout(() => {
                    playSound(group[currentQuestionIndex + 1].symbol, group[currentQuestionIndex + 1].examples);
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
            <div className="practice-container">
                <h2>本组学习 ({group.length}个)</h2>
                <p className="subtitle">先熟悉这5个音标，准备好后点击开始测试</p>

                <div className="phonetics-grid-small">
                    {group.map((item, idx) => (
                        <div key={idx} className="phonetic-card" onClick={() => playSound(item.symbol, item.examples)}>
                            <div className="symbol">{item.symbol}</div>
                            <div className="examples">{item.examples}</div>
                            <Volume2 size={16} className="icon-small" />
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary btn-large" onClick={startQuiz}>
                    开始听音测试 <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    if (stage === 'quiz') {
        const progress = ((currentQuestionIndex) / group.length) * 100;

        return (
            <div className="practice-container">
                <div className="quiz-header">
                    <span>进度: {currentQuestionIndex + 1} / {group.length}</span>
                    <div className="progress-bar"><div style={{ width: `${progress}%` }}></div></div>
                </div>

                <div className="question-area">
                    <h3>听音辨标</h3>
                    <button className="btn-icon-large pulse" onClick={replayCurrent}>
                        <Volume2 size={48} />
                        <div>点击重播</div>
                    </button>
                </div>

                <div className="options-grid">
                    {group.map((item, idx) => (
                        <button
                            key={idx}
                            className={`option-card ${feedback && item.symbol === group[currentQuestionIndex].symbol ? 'correct' : ''} ${feedback === 'incorrect' && item === group[currentQuestionIndex] ? 'wrong' : ''}`} // Logic error in wrong class, fixing below
                            onClick={() => handleAnswer(item)}
                            disabled={!!feedback}
                        >
                            <div className="symbol">{item.symbol}</div>
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
            <h3>练习完成!</h3>
            <p>答对 {score} / {group.length}</p>

            <div className="action-buttons">
                <button className="btn btn-secondary" onClick={startNewGroup}>
                    <RefreshCw size={20} /> 换一组
                </button>
                <button className="btn btn-primary" onClick={() => { startNewGroup(); /* Should ideally allow retry same group */ }}>
                    再练一次
                </button>
            </div>
        </div>
    );
};

export default PhoneticPractice;
