import React, { useState } from 'react';
import api from '../api/axios';

const Register = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ nombre: '', mail: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/usuario', formData); // POST a /user
            alert("Cuenta creada con éxito");
            if (onSuccess) onSuccess(); // Cambia a la vista de Login
        } catch (err) {
            setError(err.response?.data?.message || "El correo ya está en uso o hubo un error.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-msg">{error}</div>}
            
            <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Ej. Juan Pérez"
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                    type="email" 
                    name="mail" 
                    placeholder="correo@empresa.com"
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Crea una contraseña segura"
                    onChange={handleChange} 
                    required 
                />
            </div>
            <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>
                Registrarse
            </button>
        </form>
    );
};

export default Register;