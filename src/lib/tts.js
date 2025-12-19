

const TTS_API_URL = 'https://tts.20204.qzz.io/v1/audio/speech';
const TTS_TOKEN = 'Bearer fun764';

/**
 * Plays text using Edge-TTS API, falling back to browser SpeechSynthesis.
 * @param {string} text - The text to speak.
 * @param {string} voice - Optional voice model. Defaults to "zh-CN-XiaoxiaoNeural" for Chinese/General or can ideally detect.
 *                         But for English content we might want an English voice like "en-US-AnaNeural" or similar if supported.
 *                         User example used "zh-CN-XiaoxiaoNeural".
 */
export const playTTS = async (text, voice = 'zh-CN-XiaoxiaoNeural') => {
    try {
        // Simple heuristic: if text contains mostly English, use an English voice if not specified otherwise
        // But user specifically requested the API example with "zh-CN-XiaoxiaoNeural". 
        // We will stick to the user's requested example voice or maybe switch based on text?
        // Let's force en-US voice for English words/phonetics if the user hasn't overridden it, 
        // essentially satisfying "use edge-tts" but making it actually useful for English learning.
        // However, the user provided a specific CURL example with Xiaoxiao. I should respect the API endpoint structure.
        // I will try to use an English voice for English text if the API supports it, otherwise fallback or use Xiaoxiao.
        // Common Edge-TTS voices: en-US-AriaNeural, en-US-GuyNeural.

        let targetVoice = voice;
        if (/^[a-zA-Z\s\p{P}]+$/u.test(text)) {
            targetVoice = 'en-US-AriaNeural';
        }

        const response = await fetch(TTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TTS_TOKEN
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: targetVoice
            })
        });

        if (!response.ok) {
            throw new Error(`TTS API Error: ${response.status}`);
        }

        const blob = await response.blob();
        if (blob.size === 0) throw new Error('Empty audio blob');

        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        await new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audio.onerror = (e) => {
                URL.revokeObjectURL(audioUrl);
                reject(e);
            };
            audio.play().catch(reject);
        });

    } catch (error) {
        console.warn('Edge-TTS failed, falling back to browser synthesis:', error);

        // Fallback
        window.speechSynthesis.cancel(); // Clear queue
        const utterance = new SpeechSynthesisUtterance(text);

        // Simple language detection for fallback
        if (/[\u4e00-\u9fa5]/.test(text)) {
            utterance.lang = 'zh-CN';
        } else {
            utterance.lang = 'en-US';
        }

        window.speechSynthesis.speak(utterance);
    }
};
