import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PhoneticsPage from './pages/PhoneticsPage';
import WordsPage from './pages/WordsPage';
import SentencesPage from './pages/SentencesPage';
import TeacherPage from './pages/TeacherPage';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;
