import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/Auth.css';

const WelcomeView = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="welcome-container">
            {/* Sección de Imagen/Texto a pantalla completa */}
            <div className="welcome-info">
                <h1>Biblioteca Comenta</h1>
                <p>Tu espacio digital para el conocimiento y la comunidad.</p>
            </div>
            
            {/* Sección de Formularios */}
            <div className="auth-wrapper">
                {/* Barra de estado visual */}
                <div className="form-progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: isLogin ? '50%' : '100%' }}
                    ></div>
                </div>

                <div className="auth-header">
                    <h2>{isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? "Ingresa tus credenciales para acceder." : "Completa los datos para registrarte."}
                    </p>
                </div>

                {isLogin ? (
                    <Login />
                ) : (
                    <Register onSuccess={() => setIsLogin(true)} />
                )}
                
                <div className="auth-toggle">
                    <span>{isLogin ? "¿Nuevo aquí?" : "¿Ya eres miembro?"}</span>
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Crea una cuenta" : "Inicia sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeView;