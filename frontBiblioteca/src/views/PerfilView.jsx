import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

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
                    console.error("Error cargando perfil o favoritos:", error);
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

            {/* CONTENEDOR PRINCIPAL EN DOS COLUMNAS */}
            <div className="profile-layout" style={{ 
                display: 'flex', 
                gap: '30px', 
                marginTop: '20px',
                flexWrap: 'wrap' 
            }}>
                
                {/* COLUMNA IZQUIERDA: DATOS DEL USUARIO */}
                <div className="profile-sidebar" style={{ flex: '1', minWidth: '300px' }}>
                    <div className="recent-activity profile-card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem' }}>Datos Personales</h2>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>
                                    Editar
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="profile-info-display">
                                <div className="profile-group" style={{ marginBottom: '15px' }}>
                                    <label className="profile-label" style={{ color: '#718096', fontSize: '0.8rem' }}>Nombre</label>
                                    <p className="profile-value" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.nombre}</p>
                                </div>
                                <div className="profile-group">
                                    <label className="profile-label" style={{ color: '#718096', fontSize: '0.8rem' }}>Email</label>
                                    <p className="profile-value" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.mail}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="auth-form">
                                <input type="text" name="nombre" value={editData.nombre} onChange={handleChange} required className="profile-input" placeholder="Nombre" style={{ marginBottom: '10px' }} />
                                <input type="email" name="mail" value={editData.mail} onChange={handleChange} required className="profile-input" placeholder="Email" style={{ marginBottom: '10px' }} />
                                <input type="password" name="password" value={editData.password} onChange={handleChange} className="profile-input" placeholder="Nueva contraseña (opcional)" />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button type="submit" className="btn-primary" style={{ fontSize: '0.9rem' }}>Guardar</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel" style={{ fontSize: '0.9rem' }}>X</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: FAVORITOS */}
                <div className="profile-main" style={{ flex: '2', minWidth: '400px' }}>
                    <div className="recent-activity">
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>⭐ Mis Libros Favoritos ({favoritos.length})</h2>
                        <div className="activity-list">
                            {favoritos.length > 0 ? (
                                favoritos.map((fav) => (
                                    <div key={fav.id} className="activity-item" style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
                                        {fav.imagenUrl ? (
                                            <img src={fav.imagenUrl} alt="portada" style={{ width: '45px', borderRadius: '4px', marginRight: '15px' }} />
                                        ) : (
                                            <div style={{ width: '45px', height: '60px', backgroundColor: '#edf2f7', marginRight: '15px', borderRadius: '4px' }}></div>
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.95rem' }}><strong>{fav.titulo}</strong></p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>{fav.autor}</p>
                                        </div>
                                        <button 
                                            onClick={() => eliminarFavorito(fav.id)} 
                                            className="logout-btn" 
                                            style={{ backgroundColor: '#fff5f5', color: '#e53e3e', padding: '5px 10px', fontSize: '0.75rem', border: '1px solid #feb2b2' }}
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#a0aec0', padding: '20px' }}>No tienes libros favoritos aún.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PerfilView;