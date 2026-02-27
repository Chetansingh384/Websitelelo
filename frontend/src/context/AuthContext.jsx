import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('adminToken', user.accessToken);
            } else {
                const token = localStorage.getItem('adminToken');
                if (token === 'demo-token') {
                    setCurrentUser({
                        email: 'websitelelo.in@gmail.com',
                        displayName: 'Demo Admin',
                        isDemo: true
                    });
                } else {
                    setCurrentUser(null);
                    localStorage.removeItem('adminToken');
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginDemo = () => {
        const demoUser = { email: 'websitelelo.in@gmail.com', displayName: 'Demo Admin', isDemo: true };
        setCurrentUser(demoUser);
        localStorage.setItem('adminToken', 'demo-token');
        return Promise.resolve(demoUser);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('adminToken');
        return signOut(auth);
    };

    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, login, loginDemo, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
