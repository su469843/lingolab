import React from 'react';
import { Volume2 } from 'lucide-react';

const vowels = [
    { symbol: 'i:', examples: 'see, tree' },
    { symbol: 'ɪ', examples: 'sit, hit' },
    { symbol: 'ʊ', examples: 'good, book' },
    { symbol: 'u:', examples: 'food, blue' },
    { symbol: 'e', examples: 'bed, men' },
    { symbol: 'ə', examples: 'teacher, about' },
    { symbol: 'ɜ:', examples: 'bird, word' },
    { symbol: 'ɔ:', examples: 'door, four' },
    { symbol: 'æ', examples: 'cat, black' },
    { symbol: 'ʌ', examples: 'up, cup' },
    { symbol: 'ɑ:', examples: 'car, star' },
    { symbol: 'ɒ', examples: 'on, hot' },
    { symbol: 'ɪə', examples: 'here, near' },
    { symbol: 'eɪ', examples: 'wait, late' },
    { symbol: 'ʊə', examples: 'tour, cure' },
    { symbol: 'ɔɪ', examples: 'boy, toy' },
    { symbol: 'əʊ', examples: 'show, go' },
    { symbol: 'eə', examples: 'hair, bear' },
    { symbol: 'aɪ', examples: 'my, fly' },
    { symbol: 'aʊ', examples: 'cow, now' },
];

const consonants = [
    { symbol: 'p', examples: 'pen, pig' },
    { symbol: 'b', examples: 'bed, bad' },
    { symbol: 't', examples: 'tea, two' },
    { symbol: 'd', examples: 'did, dog' },
    { symbol: 'tʃ', examples: 'chin, chair' },
    { symbol: 'dʒ', examples: 'jun, joke' },
    { symbol: 'k', examples: 'cat, key' },
    { symbol: 'g', examples: 'get, go' },
    { symbol: 'f', examples: 'five, four' },
    { symbol: 'v', examples: 'very, van' },
    { symbol: 'θ', examples: 'thin, three' },
    { symbol: 'ð', examples: 'this, that' },
    { symbol: 's', examples: 'so, see' },
    { symbol: 'z', examples: 'zoo, zebra' },
    { symbol: 'ʃ', examples: 'shoe, she' },
    { symbol: 'ʒ', examples: 'vision, pleasure' },
    { symbol: 'm', examples: 'me, map' },
    { symbol: 'n', examples: 'no, nine' },
    { symbol: 'ŋ', examples: 'sing, song' },
    { symbol: 'h', examples: 'hello, hi' },
    { symbol: 'l', examples: 'like, leg' },
    { symbol: 'r', examples: 'red, run' },
    { symbol: 'w', examples: 'we, wet' },
    { symbol: 'j', examples: 'yes, yellow' },
];

import { useState } from 'react';
import { Volume2, BookOpen, GraduationCap } from 'lucide-react';
import PhoneticPractice from '../components/PhoneticPractice';

// ... (vowels and consonants arrays remain unchanged)

const PhoneticsPage = () => {
    const [isPractice, setIsPractice] = useState(false);

    const playSound = (symbol, examples) => {
        // Simple TTS as fallback. In real app, rely on audio files for accurate phonemes.
        // TTS often struggles with isolated phonemes.
        // Try to speak an example word instead for better clarity
        const exampleWord = examples.split(',')[0];
        const utterance = new SpeechSynthesisUtterance(exampleWord);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const allItems = [...vowels, ...consonants];

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="page-title">国际音标 (IPA)</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${!isPractice ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsPractice(false)}
                    >
                        <BookOpen size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        音标表
                    </button>
                    <button
                        className={`btn ${isPractice ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsPractice(true)}
                    >
                        <GraduationCap size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                        听音练习
                    </button>
                </div>
            </div>

            {isPractice ? (
                <PhoneticPractice items={allItems} />
            ) : (
                <>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-medium)' }}>点击卡片听发音 (通过朗读例词演示)</p>
                    <section className="dashboard-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--primary-color)' }}>元音 (Vowels)</h3>
                        <div style={gridStyle}>
                            {vowels.map((item) => (
                                <PhoneticCard key={item.symbol} item={item} onPlay={playSound} />
                            ))}
                        </div>
                    </section>

                    <section className="dashboard-section">
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--primary-color)' }}>辅音 (Consonants)</h3>
                        <div style={gridStyle}>
                            {consonants.map((item) => (
                                <PhoneticCard key={item.symbol} item={item} onPlay={playSound} />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

const PhoneticCard = ({ item, onPlay }) => (
    <div
        className="card"
        style={cardStyle}
        onClick={() => onPlay(item.symbol, item.examples)}
    >
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            [{item.symbol}]
        </div>
        <div style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            {item.examples}
        </div>
        <Volume2 size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-light)' }} />
    </div>
);

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
};

const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.1s, box-shadow 0.1s',
};

export default PhoneticsPage;
