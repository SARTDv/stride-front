import React, { useState, useEffect, useContext } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import styles from '../css/strideLogin.module.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../components/AuthToken';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from "react-router-dom";
import api from '../api/axiosInstance';


function Login() {
    const { isLoggedIn, setIsLoggedIn  } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();
        useEffect(() => {
            if (location.state && location.state.activeLink) {
                setActiveLink(location.state.activeLink);
            }
        }, [location]);    

    useEffect(() => {
        if (isLoggedIn) {
            toast.error('Already logged in', { autoClose: true });
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
      };

    const validatePassword = (password) => {
        return password && password.length >= 8;
    };
    
    
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!captchaValue) {
            toast.error('Please do Captcha!', { autoClose: true });
            return;
        }
        
        if (!validatePassword(password)) {
            toast.error('Password must be at least 8 characters long', { autoClose: true });
            return;
        }
        
        const data = {
            username,
            password,
            'g-recaptcha-response': captchaValue,
            email,
        };
    
        try {
            console.log(data);
            const response = await api.post('/api/accounts/register/', data);
            setSuccess(true);
            console.log("Usuario registrado:", response.data);
            toast.success('Registered successfully! Please verify your email.', { autoClose: true });
        } catch (error) {
            setError("Hubo un error al registrar el usuario");
            toast.error('register issue!', { autoClose: true });
            console.error("Error en el registro:", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
    
        // Verifica si el CAPTCHA ha sido completado
        if (!captchaValue) {
            toast.error('Please do CAPTCHA', { autoClose: true });
            return;
        }
    
        // Crea los datos que se enviarán en la solicitud
        const data = {
            username,
            password,
            'g-recaptcha-response': captchaValue, // Agrega el valor del CAPTCHA
        };
    
        try {
            // Realiza la solicitud POST al backend para el login
            const response = await api.post('/api/accounts/login/', data);
            const token = response.data.token;
        
            // Guarda el token en el almacenamiento local
            localStorage.setItem('token', token); 
            toast.success('¡Login exitoso!', { autoClose: true });
            setIsLoggedIn(true); // Cambia el estado de autenticación
            navigate("/home"); // Redirige al usuario al inicio
        
        } catch (error) {
            // Verifica si el error tiene una respuesta del backend
            if (error.response) {
                const errorMessage = error.response.data.error || 'Error inesperado durante el login.';
                toast.error(errorMessage, { autoClose: true });
            } else {
                // Si no hay una respuesta, muestra un mensaje genérico
                toast.error('No se pudo conectar al servidor. Por favor, intenta más tarde.', { autoClose: true });
            }
            console.error("Error en el login:", error);
        }
        
        
    };
    
    const [activeLink, setActiveLink] = useState(location.state?.activeLink || 'signin');
    const [activeButton, setActiveButton] = useState("vacio");
    const ButtonSignIn = () => { setActiveButton("log"); }; 
    const ButtonSignUp = () => { setActiveButton("reg"); };

    const frameClass = activeButton === "vacio" ? (activeLink === "signin" ? styles["frame"] : styles["frame-long"]) : styles["frame-short"];
    const formSignUp = activeButton === "vacio" ? (activeLink === "signup" ? styles["form-signup-left"] : styles["form-signup"]) : styles["form-signup-down"];

    // Funciones de manejo de clics 
    const handleClickSignIn = () => { setActiveLink("signin"); }; 
    const handleClickSignUp = () => { setActiveLink("signup"); };

    return (
        <div className={styles.divlogin}>
            <div>
                {/* Alertas de las mas alta calidddddaa */}
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
            </div>
        <div className={styles.container}>
            <div className={frameClass}>
                <div className={activeButton === "reg" ? styles["nav-up"] : styles["nav"]}>
                    <ul className={styles.links}> 
                        <li className={activeLink === "signin" ? styles["signin-active"] : styles["signin-inactive"]}> 
                            <a className={styles.btn} onClick={handleClickSignIn}>Sign in</a>
                        </li> 
                        <li className={activeLink === "signup" ? styles["signup-active"] : styles["signup-inactive"]}>
                            <a className={styles.btn} onClick={handleClickSignUp}>Sign up</a>
                        </li>
                    </ul>
                </div>
                <div> 
                    <form className={activeLink === "signin" ? styles["form-signin"] : styles["form-signin-left"]}  action="" method="post" name="form">
                        <label htmlFor="username">Username</label>
                        <input className={styles["form-styling"]}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input className={styles["form-styling"]}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                        />
                        <div className={styles["captcha-container"]}>
                            <ReCAPTCHA
                                sitekey="6LduhHgqAAAAAG6SwTg1Beu_vrBcBnf1Opozllu8"
                                onChange={handleCaptchaChange}
                            />
                        </div>                        
                        <div className={activeButton === "log" ? styles["btn-animate-grow"] : styles["btn-animate"]}>
                            <a className={styles["btn-signin"]} onClick={handleLogin}>Sign in</a>
                        </div>
                    </form>
                
                    <form className={formSignUp} action="" method="post" name="form">
                        <label htmlFor="fullname">Username</label>
                        <input className={styles["form-styling"]}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input className={styles["form-styling"]}  name="email" 
                            type="text"
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input className={styles["form-styling"]}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                        />
                        <div className={styles["captcha-container"]}>
                            <ReCAPTCHA
                                sitekey="6LduhHgqAAAAAG6SwTg1Beu_vrBcBnf1Opozllu8"
                                onChange={handleCaptchaChange}
                            />
                        </div> 
                        <div className={styles["btn-animate"]}>
                            <a className={styles["btn-signup"]} onClick={handleRegister}>Sign Up</a>
                        </div>
                       
                        
                        
                    </form>
                </div>
            
                <div className={activeButton === "log" ? styles["forgot-fade"] : (activeLink === "signin" ? styles["forgot"] : styles["forgot-left"])}>
                    <a href="#">Forgot your password?</a>
                </div>
            </div>
        </div>

    </div>
    );
}

export default Login;