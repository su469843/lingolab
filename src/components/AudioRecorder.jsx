import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';

// Simple Levenshtein distance for string matching
const similarity = (s1, s2) => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

const AudioRecorder = ({ targetText }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [score, setScore] = useState(null);
    const [error, setError] = useState('');
    const recognitionRef = React.useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.lang = 'en-US';
            recog.interimResults = false;

            recog.onstart = () => setIsRecording(true);
            recog.onend = () => setIsRecording(false);
            recog.onerror = (event) => {
                setError('Error occurred in recognition: ' + event.error);
                setIsRecording(false);
            };
            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setTranscript(transcript);
                const sim = similarity(transcript, targetText);
                setScore(Math.round(sim * 100));
            };
            recognitionRef.current = recog;
        } else {
            console.warn('Browser does not support Speech Recognition.');
        }
    }, [targetText]);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setScore(null);
            setError('');
            recognitionRef.current.start();
        }
    };

    if (error) {
        return <div style={{ color: 'red', fontSize: '0.8rem' }}>{error}</div>;
    }

    return (
        <div className="audio-recorder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button
                onClick={toggleRecording}
                className={`btn-icon ${isRecording ? 'recording' : ''}`}
                style={{
                    background: isRecording ? '#fee2e2' : 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isRecording ? '#ef4444' : 'var(--text-medium)',
                    transition: 'all 0.2s'
                }}
            >
                {isRecording ? <Square size={16} fill="#ef4444" /> : <Mic size={20} />}
            </button>

            {score !== null && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                        You said: "{transcript}"
                    </div>
                    <div style={{ fontWeight: 'bold', color: score > 80 ? '#16a34a' : score > 50 ? '#ca8a04' : '#dc2626' }}>
                        Score: {score}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
