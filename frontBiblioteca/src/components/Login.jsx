import React, { useState } from 'react';
import api from '../api/axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ mail: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/usuario/login', credentials);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/home'; // Recarga para activar la Navbar
        } catch (err) {
            setError("Credenciales incorrectas o error al iniciar sesión.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                    type="email" 
                    placeholder="correo@empresa.com" 
                    onChange={e => setCredentials({...credentials, mail: e.target.value})}
                    required 
                />
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input 
                    type="password" 
                    placeholder="Ingresa tu contraseña" 
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    required 
                />
            </div>
            <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>
                Entrar al Sistema
            </button>
        </form>
    );
};

export default Login;