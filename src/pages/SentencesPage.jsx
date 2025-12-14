import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Volume2, PlayCircle, MessageSquare } from 'lucide-react';
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--primary-50)', borderRadius: '12px', color: 'var(--primary-600)' }}>
                        <MessageSquare size={28} />
                    </div>
                    句子学习
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    通过 {sentences.length} 个精选例句掌握地道表达
                </p>
            </div>

            {sentences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--surface-100)' }}>
                    <div style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2 }} />
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>暂无句子，请前往后台添加。</p>
                </div>
            ) : (
                <div className="animate-slide-up" style={{ display: 'grid', gap: '1.5rem' }}>
                    {sentences.map(item => (
                        <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                    onClick={() => playSentence(item.text, item.id)}
                                    className="btn-icon-large"
                                    style={{
                                        background: playingId === item.id ? 'var(--primary-100)' : 'var(--surface-50)',
                                        color: playingId === item.id ? 'var(--primary-600)' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {playingId === item.id ? <Volume2 size={24} /> : <PlayCircle size={28} />}
                                </button>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>听标准音</span>
                            </div>

                            <div style={{ flex: 1, paddingRight: '1.5rem', borderRight: '1px solid var(--surface-100)' }}>
                                <div style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                                    {item.text}
                                </div>
                                <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    {item.translation}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '140px' }}>
                                <AudioRecorder targetText={item.text} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SentencesPage;
