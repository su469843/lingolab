import React, { useState } from 'react';
import { Volume2, RotateCw } from 'lucide-react';

const Flashcard = ({ word, onResult }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flashcard-container" style={{ perspective: '1000px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div
                className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
                style={innerStyle}
                onClick={handleFlip}
            >
                {/* Front */}
                <div className="flashcard-front" style={{ ...faceStyle, background: 'white' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{word.word}</div>
                    <div style={{ fontSize: '1.25rem', color: 'var(--text-medium)', marginTop: '0.5rem' }}>{word.phonetic}</div>
                    <button
                        onClick={handlePlayAudio}
                        style={{ marginTop: '1.5rem', background: 'var(--primary-light)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary-color)' }}
                    >
                        <Volume2 size={20} />
                    </button>
                    <div style={{ marginTop: 'auto', fontSize: '0.875rem', color: 'var(--text-light)' }}>点击翻转</div>
                </div>

                {/* Back */}
                <div className="flashcard-back" style={{ ...faceStyle, background: '#f8fafc', transform: 'rotateY(180deg)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '1rem' }}>{word.meaning}</div>
                    <div style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-medium)', textAlign: 'center' }}>"{word.example}"</div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', width: '100%' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onResult(false); }}
                            className="btn"
                            style={{ flex: 1, background: '#fee2e2', color: '#ef4444' }}
                        >
                            不认识
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onResult(true); }}
                            className="btn"
                            style={{ flex: 1, background: '#dcfce7', color: '#22c55e' }}
                        >
                            认识
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 300px;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .flashcard-inner.flipped {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 1px solid var(--border-color);
        }
      `}</style>
        </div>
    );
};

const innerStyle = {}; // handled by css in style tag for hover/flip states
const faceStyle = {}; // handled above

export default Flashcard;
