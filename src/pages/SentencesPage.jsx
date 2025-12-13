import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Volume2, PlayCircle } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';

const SentencesPage = () => {
    const { sentences } = useData();
    const [playingId, setPlayingId] = useState(null);

    const playSentence = (text, id) => {
        setPlayingId(id);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onend = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="page-container">
            <h2 className="page-title">句子学习</h2>

            {sentences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                    暂无句子，请前往教师后台添加。
                </div>
            ) : (
                <div className="sentences-list" style={{ display: 'grid', gap: '1rem' }}>
                    {sentences.map(item => (
                        <div key={item.id} className="card sentence-card" style={cardStyle}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                    onClick={() => playSentence(item.text, item.id)}
                                    className="btn-icon-large"
                                    style={{
                                        background: playingId === item.id ? 'var(--primary-light)' : 'transparent',
                                        color: 'var(--primary-color)',
                                        border: '1px solid var(--primary-light)',
                                        borderRadius: '50%',
                                        width: '48px',
                                        height: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}
                                >
                                    {playingId === item.id ? <Volume2 size={24} /> : <PlayCircle size={24} />}
                                </button>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>听</span>
                            </div>

                            <div style={{ flex: 1, paddingRight: '1rem', borderRight: '1px dashed var(--border-color)' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                                    {item.text}
                                </div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-medium)' }}>
                                    {item.translation}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                                <AudioRecorder targetText={item.text} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>读</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
};

export default SentencesPage;
