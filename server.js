import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wordsHandler from './api/words/index.js';
import sentencesHandler from './api/sentences/index.js';
import loginHandler from './api/auth/login.js';
import registerHandler from './api/auth/register.js';
import meHandler from './api/auth/me.js';
import textbooksHandler from './api/textbooks/index.js';
import homeworkHandler from './api/homework/index.js';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Helper to adapt Vercel function signature (req, res) to Express
const adapter = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Routes
app.all('/api/words', adapter(wordsHandler));
app.all('/api/words', adapter(wordsHandler));
app.all('/api/sentences', adapter(sentencesHandler));
app.all('/api/auth/login', adapter(loginHandler));
app.all('/api/auth/register', adapter(registerHandler));
app.all('/api/auth/me', adapter(meHandler));
app.all('/api/textbooks', adapter(textbooksHandler));
app.all('/api/homework', adapter(homeworkHandler));

app.listen(port, () => {
    console.log(`Local API server running at http://localhost:${port}`);
});
