import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import PhoneticsPage from './pages/PhoneticsPage';
import WordsPage from './pages/WordsPage';
import SentencesPage from './pages/SentencesPage';
import TeacherPage from './pages/TeacherPage';

function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="phonetics" element={<PhoneticsPage />} />
                        <Route path="words" element={<WordsPage />} />
                        <Route path="sentences" element={<SentencesPage />} />
                        <Route path="teacher" element={<TeacherPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
}

export default App;
