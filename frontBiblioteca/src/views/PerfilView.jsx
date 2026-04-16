import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';
import '../styles/Perfil.css'; // Importación del nuevo CSS

const PerfilView = () => {
    const [user, setUser] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ nombre: '', mail: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const localUser = JSON.parse(localStorage.getItem('user'));
            if (localUser && localUser.id) {
                try {
                    const userResponse = await api.get(`/usuario/${localUser.id}`);
                    setUser(userResponse.data);
                    setEditData({ 
                        nombre: userResponse.data.nombre, 
                        mail: userResponse.data.mail, 
                        password: '' 
                    });
                    
                    const favResponse = await api.get(`/favoritos/usuario/${localUser.id}`);
                    setFavoritos(favResponse.data);
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                    setUser(localUser); 
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
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccessMsg("¡Perfil actualizado!");
            setIsEditing(false);
            setEditData({ ...editData, password: '' });
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar.");
        }
    };

    const eliminarFavorito = async (favoritoId) => {
        if (!window.confirm("¿Eliminar de favoritos?")) return;
        try {
            await api.delete(`/favoritos/${favoritoId}`);
            setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
            setSuccessMsg("Eliminado correctamente");
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setError("Error al eliminar.");
        }
    };

    if (!user) return <div className="home-container">Cargando...</div>;

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Panel de Usuario 👤</h1>
                <p>Gestiona tu información y biblioteca personal en un solo lugar.</p>
            </header>

            {error && <div className="error-msg">{error}</div>}
            {successMsg && <div className="success-msg">{successMsg}</div>}

            <div className="profile-layout">
                
                {/* COLUMNA IZQUIERDA: DATOS */}
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <h2>Datos Personales</h2>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="btn-secondary btn-small">
                                    Editar
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="profile-info-display">
                                <div className="profile-group">
                                    <label className="profile-label">Nombre</label>
                                    <p className="profile-value">{user.nombre}</p>
                                </div>
                                <div className="profile-group">
                                    <label className="profile-label">Email</label>
                                    <p className="profile-value">{user.mail}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="edit-form-group">
                                <input type="text" name="nombre" value={editData.nombre} onChange={handleChange} required className="profile-input" placeholder="Nombre" />
                                <input type="email" name="mail" value={editData.mail} onChange={handleChange} required className="profile-input" placeholder="Email" />
                                <input type="password" name="password" value={editData.password} onChange={handleChange} className="profile-input" placeholder="Nueva contraseña (opcional)" />
                                <div className="button-group">
                                    <button type="submit" className="btn-primary btn-small">Guardar</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel btn-small">X</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: FAVORITOS */}
                <div className="profile-main">
                    <div className="profile-card">
                        <h2 className="favorites-title">⭐ Mis Libros Favoritos ({favoritos.length})</h2>
                        <div className="activity-list">
                            {favoritos.length > 0 ? (
                                favoritos.map((fav) => (
                                    <div key={fav.id} className="fav-item">
                                        {fav.imagenUrl ? (
                                            <img src={fav.imagenUrl} alt="portada" className="fav-cover" />
                                        ) : (
                                            <div className="fav-placeholder"></div>
                                        )}
                                        <div className="fav-info">
                                            <p className="fav-title">{fav.titulo}</p>
                                            <p className="fav-author">{fav.autor}</p>
                                        </div>
                                        <button 
                                            onClick={() => eliminarFavorito(fav.id)} 
                                            className="btn-remove"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>No tienes libros favoritos aún.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PerfilView;