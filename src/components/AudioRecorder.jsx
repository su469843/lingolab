import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

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

const ERROR_MAP = {
    'no-speech': '未检测到语音，请再试一次。',
    'audio-capture': '无法获取麦克风音频，请检查权限。',
    'not-allowed': '麦克风权限被拒绝，请在浏览器设置中开启。',
    'service-not-allowed': '语音识别服务不可用。录音功能需要系统语音引擎支持，请在设备上安装并启用 Google 语音服务或其他语音引擎。',
    'network': '网络连接错误，请检查网络。',
    'aborted': '录音已中止。',
    'language-not-supported': '当前浏览器不支持英语 (en-US) 识别。'
};


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
                const errorMessage = ERROR_MAP[event.error] || '发生错误: ' + event.error;
                setError(errorMessage);
                setIsRecording(false);
                console.error('Speech Recognition Error:', event.error);
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
            setError('Browser not supported');
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

    if (error === 'Browser not supported') {
        return <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Not supported</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <button
                onClick={toggleRecording}
                style={{
                    background: isRecording ? '#fee2e2' : 'var(--primary-500)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isRecording ? '#ef4444' : 'white',
                    transition: 'all 0.2s',
                    boxShadow: isRecording ? '0 0 0 4px #fecaca' : '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
            >
                {isRecording ? <Square size={20} fill="#ef4444" /> : <Mic size={24} />}
            </button>

            <div style={{ textAlign: 'center', minHeight: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {isRecording ? (
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Loader2 size={12} className="animate-spin" /> 正在录音...
                    </div>
                ) : score !== null ? (
                    <div className="animate-fade-in">
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: score > 80 ? '#16a34a' : score > 60 ? '#ca8a04' : '#dc2626', lineHeight: 1 }}>
                            {score}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>分</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                            "{transcript}"
                        </div>
                    </div>
                ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 500 }}>
                        点击跟读
                    </span>
                )}
            </div>
            {error && error !== 'Browser not supported' && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{error}</div>}
        </div>
    );
};

export default AudioRecorder;
