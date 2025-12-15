import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

function EmailVerification() {
    // Estados para manejar el proceso de verificación
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        error: null
    });

    // Hooks para navegación y obtener parámetros de URL
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Función asíncrona para verificar email
        const verifyEmail = async () => {
            try {
                // Extraer token de la URL
                const token = new URLSearchParams(location.search).get('token');
                
                // Validar que el token exista
                if (!token) {
                    throw new Error('Token de verificación no proporcionado');
                }

                // Realizar petición al backend
                const response = await api.get(`/api/accounts/verify-email/?token=${token}`);
                
                // Actualizar estado de verificación
                setStatus({
                    loading: false,
                    success: true,
                    error: null
                });

                // Notificación de éxito
                toast.success('Email verificado correctamente');
                
                // Redirigir al login
                navigate('/login', { 
                    state: { 
                        message: 'Email verificado. Puedes iniciar sesión.' 
                    } 
                });

            } catch (error) {
                // Manejar diferentes tipos de errores
                const errorMessage = error.response?.data?.error || 'Error de verificación';
                
                setStatus({
                    loading: false,
                    success: false,
                    error: errorMessage
                });

                // Notificación de error
                toast.error(errorMessage);
            }
        };

        // Ejecutar verificación
        verifyEmail();
    }, [location, navigate]);

    // Renderizado condicional
    if (status.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner">Verificando email...</div>
            </div>
        );
    }

    if (status.error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="error-container">
                    <h2>Error de Verificación</h2>
                    <p>{status.error}</p>
                    <button 
                        onClick={() => navigate('/resend-verification')}
                        className="btn btn-primary"
                    >
                        Reenviar Email de Verificación
                    </button>
                </div>
            </div>
        );
    }

    // Componente por defecto (raramente se mostrará)
    return null;
}

export default EmailVerification;