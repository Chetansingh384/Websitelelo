import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Stats from './components/Stats';

// Page Imports
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Admin Imports
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminPlans from './admin/pages/Plans';
import AdminPortfolio from './admin/pages/Portfolio';
import AdminTeam from './admin/pages/Team';
import AdminTestimonials from './admin/pages/Testimonials';
import AdminContacts from './admin/pages/Contacts';
import AdminLayout from './admin/components/Layout';

import { motion, AnimatePresence } from 'framer-motion';

const MainLanding = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Navbar />
        <main>
            <Hero />
            <Services />
            <Stats />
            <WhyChooseUs />
            <Team />
            <Pricing />
            <Portfolio />
            <Testimonials />
            <Contact />
        </main>
        <Footer />
    </motion.div>
);

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/admin" />;
};

function AppContent() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-dark text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <div className="loader mb-6"></div>
                            <div className="text-3xl font-black gradient-text tracking-tighter">
                                WebsiteLelo
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!loading && (
                <div className="flex flex-col min-h-screen">
                    <Routes>
                        <Route path="/" element={<MainLanding />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route
                            path="/admin/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="plans" element={<AdminPlans />} />
                            <Route path="portfolio" element={<AdminPortfolio />} />
                            <Route path="team" element={<AdminTeam />} />
                            <Route path="testimonials" element={<AdminTestimonials />} />
                            <Route path="contacts" element={<AdminContacts />} />
                        </Route>

                        {/* Catch All */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
