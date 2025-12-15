import React, { createContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); 
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false)
        toast.success('Logged out successfully!', { autoClose: true });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogout, setIsLoggedIn}}>
            <div>
                {/* Alertas de las mas alta calidddddaa */}
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
            </div>
            {children}
        </AuthContext.Provider>
    );
};
