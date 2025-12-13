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
                />
            </div>
        );
    }

    if (finished && view === 'flashcard') {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>🎉 背诵完成!</h2>
                <p style={{ marginBottom: '2rem' }}>您已经复习了所有单词。</p>
                <button onClick={resetView} className="btn btn-primary">
                    <RotateCcw size={18} style={{ marginRight: '0.5rem' }} /> 返回列表
                </button>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="page-title" style={{ marginBottom: 0 }}>单词库</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={startFlashcard} className="btn btn-secondary" disabled={words.length === 0}>
                        <Book size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        全量背诵
                    </button>
                    <button onClick={startPractice} className="btn btn-primary" disabled={words.length === 0}>
                        <GraduationCap size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        分组测验
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
