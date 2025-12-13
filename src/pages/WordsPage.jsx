<<<<<<< HEAD
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Flashcard from '../components/Flashcard';
import WordsPractice from '../components/WordsPractice';
import { Book, RotateCcw, GraduationCap, LayoutGrid } from 'lucide-react';

const WordsPage = () => {
    const { words } = useData();
    const [view, setView] = useState('list'); // 'list', 'flashcard', 'practice'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [finished, setFinished] = useState(false);

    const startFlashcard = () => {
        setView('flashcard');
        setCurrentIndex(0);
        setFinished(false);
    };

    const startPractice = () => {
        setView('practice');
    };

    const handleResult = (known) => {
        // Integrate with progress tracking later
        console.log(`Word ${words[currentIndex].word}: ${known ? 'Known' : 'Unknown'}`);

        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setFinished(true);
        }
    };

    const resetView = () => {
        setView('list');
        setFinished(false);
    };

    if (view === 'practice') {
        return (
            <div className="page-container">
                <div style={{ marginBottom: '2rem' }}>
                    <button onClick={resetView} className="btn btn-secondary">
                        <LayoutGrid size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        返回列表
                    </button>
                </div>
                <WordsPractice words={words} />
            </div>
        );
    }

    if (view === 'flashcard' && !finished) {
        const currentWord = words[currentIndex];
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={resetView} className="btn btn-secondary">退出背诵</button>
                    <span style={{ color: 'var(--text-light)' }}>{currentIndex + 1} / {words.length}</span>
                </div>
                <Flashcard
                    key={currentWord.id} // Reset state on change
                    word={currentWord}
                    onResult={handleResult}
=======
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Flashcard from '../components/Flashcard';
import { Book, RotateCcw, Volume2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const BATCH_SIZE = 5;

const WordsPage = () => {
    const { words } = useData();
    const [mode, setMode] = useState('list'); // 'list' | 'learn' | 'quiz' | 'finished'
    const [queue, setQueue] = useState([]); // All words to study
    const [currentBatch, setCurrentBatch] = useState([]);
    const [batchIndex, setBatchIndex] = useState(0); // Index within current batch
    const [quizScore, setQuizScore] = useState(0);

    // Quiz State
    const [quizOptions, setQuizOptions] = useState([]);
    const [quizResult, setQuizResult] = useState(null); // 'correct' | 'incorrect'

    // Textbook Filter
    const [textbooks, setTextbooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('all');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('/api/textbooks', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                    setTextbooks(await res.json());
                }
            } catch (error) { console.error(error); }
        };
        fetchBooks();
    }, []);

    const startSession = () => {
        // Filter words if book selected
        let validWords = [...words];
        if (selectedBookId !== 'all') {
            // We need to know which words belong to which book.
            // Currently 'words' from DataContext might not have textbookId if not fetched.
            // Assuming DataContext 'words' array includes 'textbookId'.
            // If not, we might need to rely on the backend to filter or update DataContext.
            // For now, let's assume 'words' has 'textbookId'.
            validWords = words.filter(w => w.textbookId === parseInt(selectedBookId));
        }

        if (validWords.length === 0) {
            alert('该教材下暂无单词');
            return;
        }

        // Shuffle words and start
        const shuffled = [...validWords].sort(() => 0.5 - Math.random());
        setQueue(shuffled);
        loadNextBatch(shuffled);
    };

    const loadNextBatch = (currentQueue) => {
        if (currentQueue.length === 0) {
            setMode('finished');
            return;
        }
        const nextBatch = currentQueue.slice(0, BATCH_SIZE);
        const remaining = currentQueue.slice(BATCH_SIZE);
        setQueue(remaining);
        setCurrentBatch(nextBatch);
        setBatchIndex(0);
        setMode('learn'); // Start with Learning Phase
    };

    /**
     * LEARN PHASE HANDLERS
     */
    const handleLearnResult = (known) => {
        // Simple logic: pass regardless of known/unknown for now, just move to next
        if (batchIndex < currentBatch.length - 1) {
            setBatchIndex(prev => prev + 1);
        } else {
            // Batch learned, move to Quiz Phase
            startQuizPhase();
        }
    };

    /**
     * QUIZ PHASE HANDLERS
     */
    const startQuizPhase = () => {
        setMode('quiz');
        setBatchIndex(0);
        setQuizScore(0);
        generateQuizOptions(0);
    };

    const generateQuizOptions = (index) => {
        const correctWord = currentBatch[index];
        // Pick 3 random distractors from other words (not in current batch or just random from total pool)
        const distractors = words
            .filter(w => w.id !== correctWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const options = [...distractors, correctWord].sort(() => 0.5 - Math.random());
        setQuizOptions(options);

        // Auto play sound
        setTimeout(() => playSound(correctWord.phonetic, correctWord.word), 500);
    };

    const playSound = (phonetic, word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleQuizAnswer = (selectedWord) => {
        const correctWord = currentBatch[batchIndex];
        if (selectedWord.id === correctWord.id) {
            setQuizResult('correct');
        } else {
            setQuizResult('incorrect');
        }

        setTimeout(() => {
            setQuizResult(null);
            if (batchIndex < currentBatch.length - 1) {
                setBatchIndex(prev => prev + 1);
                generateQuizOptions(batchIndex + 1);
            } else {
                // Batch Quiz Finished, load next batch
                loadNextBatch(queue);
            }
        }, 1200);
    };

    /**
     * RENDERERS
     */
    if (mode === 'learn') {
        const currentWord = currentBatch[batchIndex];
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setMode('list')} className="btn btn-secondary">退出</button>
                    <span style={{ color: 'var(--text-light)' }}>记忆阶段: {batchIndex + 1} / {currentBatch.length}</span>
                </div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>记忆模式 (每组5个)</h3>
                <Flashcard
                    key={`learn-${currentWord.id}`}
                    word={currentWord}
                    onResult={handleLearnResult}
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
                />
            </div>
        );
    }

<<<<<<< HEAD
    if (finished && view === 'flashcard') {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>🎉 背诵完成!</h2>
                <p style={{ marginBottom: '2rem' }}>您已经复习了所有单词。</p>
                <button onClick={resetView} className="btn btn-primary">
=======
    if (mode === 'quiz') {
        const currentWord = currentBatch[batchIndex];
        return (
            <div className="page-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setMode('list')} className="btn btn-secondary">退出</button>
                    <span style={{ color: 'var(--text-light)' }}>测验阶段: {batchIndex + 1} / {currentBatch.length}</span>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <button
                        className="btn-icon"
                        style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white' }}
                        onClick={() => playSound(currentWord.phonetic, currentWord.word)}
                    >
                        <Volume2 size={40} />
                    </button>
                    <p style={{ marginTop: '1rem', color: 'var(--text-medium)' }}>点击播放，选择正确的单词/释义</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {quizOptions.map(option => (
                        <div
                            key={option.id}
                            className="card"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                background: quizResult && option.id === currentWord.id ? '#dcfce7' :
                                    quizResult === 'incorrect' && quizResult && option.id !== currentWord.id ? 'white' : 'white',
                                border: quizResult === 'incorrect' && option.id !== currentWord.id ? '1px solid white' : '1px solid var(--border-color)',
                                opacity: quizResult && option.id !== currentWord.id ? 0.5 : 1
                            }}
                            onClick={() => !quizResult && handleQuizAnswer(option)}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{option.meaning}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{option.word}</div>
                        </div>
                    ))}
                </div>

                {quizResult === 'correct' && (
                    <div style={{ marginTop: '2rem', color: 'green', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <CheckCircle style={{ display: 'inline', marginRight: '0.5rem' }} /> 正确!
                    </div>
                )}
                {quizResult === 'incorrect' && (
                    <div style={{ marginTop: '2rem', color: 'red', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <XCircle style={{ display: 'inline', marginRight: '0.5rem' }} /> 错误!
                    </div>
                )}
            </div>
        );
    }

    if (mode === 'finished') {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>🎉 所有分组学习完成!</h2>
                <p style={{ marginBottom: '2rem' }}>您已经完成了本轮学习和测验。</p>
                <button onClick={() => setMode('list')} className="btn btn-primary">
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
                    <RotateCcw size={18} style={{ marginRight: '0.5rem' }} /> 返回列表
                </button>
            </div>
        )
    }

<<<<<<< HEAD
=======
    // LIST VIEW
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="page-title" style={{ marginBottom: 0 }}>单词库</h2>
<<<<<<< HEAD
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={startFlashcard} className="btn btn-secondary" disabled={words.length === 0}>
                        <Book size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        全量背诵
                    </button>
                    <button onClick={startPractice} className="btn btn-primary" disabled={words.length === 0}>
                        <GraduationCap size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        分组测验
=======
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={selectedBookId}
                        onChange={e => setSelectedBookId(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="all">所有教材</option>
                        {textbooks.map(b => (
                            <option key={b.id} value={b.id}>{b.title}</option>
                        ))}
                    </select>
                    <button onClick={startSession} className="btn btn-primary" disabled={words.length === 0}>
                        <Book size={18} style={{ marginRight: '0.5rem' }} /> 开始智能学习
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
                    </button>
                </div>
            </div>

            {words.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                    暂无单词，请前往教师后台添加。
                </div>
            ) : (
                <div className="word-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {words.map(word => (
                        <div key={word.id} className="card" style={{ padding: '1.25rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{word.word}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{word.phonetic}</div>
                            <div style={{ marginTop: '0.5rem', color: 'var(--text-medium)', fontSize: '0.95rem' }}>{word.meaning}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WordsPage;
