export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { model, input, voice } = req.body;

        const response = await fetch('https://tts.20204.qzz.io/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fun764'
            },
            body: JSON.stringify({
                model: model || 'tts-1',
                input,
                voice: voice || 'en-US-AriaNeural'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('TTS API Error:', response.status, errorText);
            return res.status(response.status).json({
                error: `TTS API Error: ${response.status}`,
                details: errorText
            });
        }

        const audioBuffer = await response.arrayBuffer();

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);
        res.status(200).send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('TTS Proxy Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
