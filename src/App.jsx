import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PhoneticsPage from './pages/PhoneticsPage';
import WordsPage from './pages/WordsPage';
import SentencesPage from './pages/SentencesPage';
import TeacherPage from './pages/TeacherPage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage'; // Imported
import LandingPage from './pages/LandingPage'; // Imported IndexRoute handles this, but App needs to render index route.
import IndexRoute from './components/IndexRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Entry Point */}
            <Route path="/" element={<IndexRoute />} />

            {/* Auth Page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Application Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/phonetics" element={<PhoneticsPage />} />
                <Route path="/words" element={<WordsPage />} />
                <Route path="/sentences" element={<SentencesPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
