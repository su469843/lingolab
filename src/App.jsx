import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import PhoneticsPage from './pages/PhoneticsPage';
import WordsPage from './pages/WordsPage';
import SentencesPage from './pages/SentencesPage';
import TeacherPage from './pages/TeacherPage';
<<<<<<< HEAD

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
=======
import LoginPage from './pages/LoginPage';
import HomeworkPage from './pages/HomeworkPage';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="phonetics" element={<PhoneticsPage />} />
              <Route path="words" element={<WordsPage />} />
              <Route path="sentences" element={<SentencesPage />} />
              <Route path="homework" element={<HomeworkPage />} />
              <Route
                path="teacher"
                element={
                  <ProtectedRoute roles={['TEACHER']}>
                    <TeacherPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
>>>>>>> 50bbfd0 (Initial commit: Complete LingoLab Application v1)
}

export default App;
