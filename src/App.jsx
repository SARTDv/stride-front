import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import StrideLayout from './components/StrideLayout';
import Home from './pages/home';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Shop from './pages/shop';
import ProductDetails from './pages/productDetails';
import StrideLogin from './pages/strideLogin';
import OrderPage from './pages/orders';
import EmailVerification from './pages/EmailVerification';
import { AuthProvider, AuthContext } from './components/AuthToken';
import Admin from './pages/admin/admin'
import AccountPage from './pages/account';
import ProtectedRoute from './components/RutaLogeada'; // Importa el componente de rutas protegidas



const AppContent = () => {
    const { isLoggedIn } = useContext(AuthContext); 

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<StrideLogin />} />
                <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                <Route path="/" element={<StrideLayout />}>
                    <Route index element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home key={isLoggedIn} />} /> 
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/productDetails" element={<ProductDetails />} />
                    <Route path="/verify-email" element={<EmailVerification />} />

                    <Route
                        path="/myAccount"
                        element={
                            <ProtectedRoute>
                                <AccountPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/MyOrders"
                        element={
                            <ProtectedRoute>
                                <OrderPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;