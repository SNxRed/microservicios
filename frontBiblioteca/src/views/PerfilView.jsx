import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

const PerfilView = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ nombre: '', mail: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const localUser = JSON.parse(localStorage.getItem('user'));
            
            if (localUser && localUser.id) {
                try {
                    const response = await api.get(`/usuario/${localUser.id}`);
                    setUser(response.data);
                    setEditData({ nombre: response.data.nombre, mail: response.data.mail, password: '' });
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                    setUser(localUser); 
                    setEditData({ nombre: localUser.nombre, mail: localUser.mail, password: '' });
                }
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const response = await api.put(`/usuario/${user.id}`, editData);
            
            const updatedUser = response.data;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            window.dispatchEvent(new Event("userLogin"));
            
            setSuccessMsg("¡Perfil actualizado con éxito!");
            setIsEditing(false); 
            
            setEditData({ ...editData, password: '' });
            
            setTimeout(() => setSuccessMsg(''), 3000);
            
        } catch (err) {
            setError(err.response?.data?.message || "Hubo un error al actualizar el perfil.");
        }
    };

    const handleCancel = () => {
        setEditData({ nombre: user.nombre, mail: user.mail, password: '' });
        setIsEditing(false);
        setError('');
    };

    if (!user) {
        return <div className="home-container loading-container">Cargando datos...</div>;
    }

    return (
        <div className="home-container">
            <header className="home-header profile-header-flex">
                <div>
                    <h1>Mi Perfil 👤</h1>
                    <p>Gestiona tu información personal.</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary">
                        Editar Perfil
                    </button>
                )}
            </header>

            <div className="recent-activity profile-card">
                {error && <div className="error-msg">{error}</div>}
                {successMsg && <div className="success-msg">{successMsg}</div>}

                {!isEditing ? (
                    // MODO VISTA
                    <>
                        <div className="profile-group">
                            <label className="profile-label">Nombre Completo:</label>
                            <p className="profile-value">{user.nombre}</p>
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Correo Electrónico:</label>
                            <p className="profile-value">{user.mail}</p>
                        </div>
                    </>
                ) : (
                    // MODO EDICIÓN
                    <form onSubmit={handleSave} className="auth-form">
                        <div className="profile-group">
                            <label className="profile-label">Nombre Completo:</label>
                            <input 
                                type="text" 
                                name="nombre"
                                value={editData.nombre}
                                onChange={handleChange}
                                required
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Correo Electrónico:</label>
                            <input 
                                type="email" 
                                name="mail"
                                value={editData.mail}
                                onChange={handleChange}
                                required
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Nueva Contraseña (Opcional):</label>
                            <input 
                                type="password" 
                                name="password"
                                value={editData.password}
                                onChange={handleChange}
                                placeholder="Déjalo en blanco para no cambiarla"
                                className="profile-input"
                            />
                        </div>
                        
                        <div className="profile-actions">
                            <button type="submit" className="btn-primary btn-save">
                                Guardar Cambios
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PerfilView;