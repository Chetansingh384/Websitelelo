import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Portfolio from './pages/Portfolio';
import Contacts from './pages/Contacts';
import Layout from './components/Layout';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('adminToken');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard/*"
                    element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
                >
                    <Route index element={<Dashboard />} />
                    <Route path="plans" element={<Plans />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="contacts" element={<Contacts />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
};

export default App;
