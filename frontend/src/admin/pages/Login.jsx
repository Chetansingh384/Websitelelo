import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login, loginDemo } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login Error:', err.message);
            // Even if backend fails, enable demo login for this specific ID if no response or 401
            if (email === 'websitelelo.in@gmail.com' && password === 'webistelelo@2026') {
                // This is a fallback for demo purposes, actual login should handle authentication
                // The 'login' function from useAuth should ideally handle this internally if it's a valid demo user
                // For now, we'll simulate a successful login with a dummy token if the Firebase login fails for this specific demo user.
                // In a real scenario, the Firebase login itself would authenticate this user.
                console.warn('Firebase login failed for demo user, proceeding with demo token.');
                loginDemo();
                navigate('/admin/dashboard');
            } else {
                setError('Invalid credentials or unauthorized access');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-md w-full bg-[#111827] dark:bg-[#111827] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 text-primary">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Control</h1>
                    <p className="text-gray-500 text-sm">Enter credentials for WebsiteLelo Admin</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-xs text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-primary" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder="websitelelo.in@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-primary" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-600">
                        Forgot password? Contact system administrator.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
