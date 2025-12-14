import React, { useState } from 'react';
import { Volume2, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import PhoneticPractice from '../components/PhoneticPractice';

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

const PhoneticsPage = () => {
    const [isPractice, setIsPractice] = useState(false);

    const playSound = (symbol, examples) => {
        const exampleWord = examples.split(',')[0];
        const utterance = new SpeechSynthesisUtterance(exampleWord);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const allItems = [...vowels, ...consonants];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary-100)', borderRadius: '12px', color: 'var(--primary-600)' }}><Volume2 size={28} /></div>
                        国际音标 (IPA)
                    </h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        {isPractice ? '听音辨别练习模式' : '点击卡片听发音，掌握标准口语'}
                    </p>
                </div>

                <div style={{ display: 'flex', background: 'var(--surface-100)', padding: '0.25rem', borderRadius: 'var(--radius-lg)' }}>
                    <button
                        className="btn"
                        style={{
                            background: !isPractice ? 'white' : 'transparent',
                            boxShadow: !isPractice ? 'var(--shadow-sm)' : 'none',
                            color: !isPractice ? 'var(--primary-600)' : 'var(--text-muted)',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.9rem'
                        }}
                        onClick={() => setIsPractice(false)}
                    >
                        <BookOpen size={16} /> 学习表
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: isPractice ? 'white' : 'transparent',
                            boxShadow: isPractice ? 'var(--shadow-sm)' : 'none',
                            color: isPractice ? 'var(--primary-600)' : 'var(--text-muted)',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.9rem'
                        }}
                        onClick={() => setIsPractice(true)}
                    >
                        <GraduationCap size={16} /> 练习模式
                    </button>
                </div>
            </div>

            {isPractice ? (
                <div className="animate-fade-in">
                    <PhoneticPractice items={allItems} />
                </div>
            ) : (
                <div className="animate-slide-up">
                    <section style={{ marginBottom: '3rem' }}>
                        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>元音 (Vowels)</h2>
                            <span style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{vowels.length}</span>
                        </div>
                        <div style={gridStyle}>
                            {vowels.map((item) => (
                                <PhoneticCard key={item.symbol} item={item} onPlay={playSound} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>辅音 (Consonants)</h2>
                            <span style={{ background: 'var(--secondary-50)', color: 'var(--secondary-500)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{consonants.length}</span>
                        </div>
                        <div style={gridStyle}>
                            {consonants.map((item) => (
                                <PhoneticCard key={item.symbol} item={item} onPlay={playSound} />
                            ))}
                        </div>
                    </section>
                </div>
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
        <div style={{ fontSize: '2.25rem', fontFamily: 'serif', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.5rem' }}>
            {item.symbol}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {item.examples}
        </div>
        <div className="icon-play" style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.3, transition: '0.2s' }}>
            <Volume2 size={16} />
        </div>
    </div>
);

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '1.25rem',
};

const cardStyle = {
    background: 'white',
    padding: '1.5rem 1rem',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--surface-100)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    textAlign: 'center'
};

export default PhoneticsPage;
