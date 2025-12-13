import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const API_BASE = '/api';

export const DataProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
<<<<<<< HEAD
    const [progress, setProgress] = useState({});
=======
    const [progress, setProgress] = useState(() => {
        try {
            const saved = localStorage.getItem('app_progress');
            return saved ? JSON.parse(saved) : {};
        } catch (e) { return {}; }
    });
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
    const [loading, setLoading] = useState(true);

    // Fetch words from API
    const fetchWords = async () => {
        try {
            const res = await fetch(`${API_BASE}/words`);
            if (res.ok) {
                const data = await res.json();
                setWords(data);
            }
        } catch (error) {
            console.error('Failed to fetch words:', error);
            // Fallback to initial mock data
            setWords([
                { id: 1, word: 'apple', phonetic: '/ˈæp.l/', meaning: 'A common fruit', example: 'I ate an apple.' },
                { id: 2, word: 'banana', phonetic: '/bəˈnæn.ə/', meaning: 'A long yellow fruit', example: 'Minions love bananas.' }
            ]);
        }
    };

    // Fetch sentences from API
    const fetchSentences = async () => {
        try {
            const res = await fetch(`${API_BASE}/sentences`);
            if (res.ok) {
                const data = await res.json();
                setSentences(data);
            }
        } catch (error) {
            console.error('Failed to fetch sentences:', error);
            // Fallback to initial mock data
            setSentences([
                { id: 1, text: 'The quick brown fox jumps over the lazy dog.', translation: '敏捷的棕色狐狸跳过了懒狗。' }
            ]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchWords(), fetchSentences()]);
            setLoading(false);
        };
        loadData();
<<<<<<< HEAD

        // Load progress from localStorage (client-side only)
        const savedProgress = localStorage.getItem('app_progress');
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
        }
=======
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
    }, []);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('app_progress', JSON.stringify(progress));
    }, [progress]);

    // Actions
    const addWord = async (newWord) => {
        try {
            const res = await fetch(`${API_BASE}/words`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWord)
            });
            if (res.ok) {
                const created = await res.json();
                setWords(prev => [created, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add word:', error);
        }
    };

    const deleteWord = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/words?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setWords(prev => prev.filter(w => w.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete word:', error);
        }
    };

    const addSentence = async (newSentence) => {
        try {
            const res = await fetch(`${API_BASE}/sentences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSentence)
            });
            if (res.ok) {
                const created = await res.json();
                setSentences(prev => [created, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add sentence:', error);
        }
    };

    const deleteSentence = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/sentences?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setSentences(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete sentence:', error);
        }
    };

    return (
        <DataContext.Provider value={{ words, sentences, progress, loading, addWord, deleteWord, addSentence, deleteSentence, setProgress }}>
            {children}
        </DataContext.Provider>
    );
};
