import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

const IndexRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <LandingPage />;
};

export default IndexRoute;
