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
                    // 1. Cargar datos actualizados del usuario
                    const userResponse = await api.get(`/usuario/${localUser.id}`);
                    setUser(userResponse.data);
                    setEditData({ 
                        nombre: userResponse.data.nombre, 
                        mail: userResponse.data.mail, 
                        password: '' 
                    });
                    
                    // 2. Cargar la lista de favoritos del usuario
                    const favResponse = await api.get(`/favoritos/usuario/${localUser.id}`);
                    setFavoritos(favResponse.data);
                } catch (error) {
                    console.error("Error cargando perfil o favoritos:", error);
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
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccessMsg("¡Perfil actualizado con éxito!");
            setIsEditing(false);
            setEditData({ ...editData, password: '' });
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Hubo un error al actualizar.");
        }
    };

    const eliminarFavorito = async (favoritoId) => {
        // Confirmación de seguridad
        if (!window.confirm("¿Estás seguro de que quieres eliminar este libro de tus favoritos?")) return;

        try {
            // Llamada al nuevo endpoint DELETE
            await api.delete(`/favoritos/${favoritoId}`);
            
            // Actualización del estado local (Filtramos el que eliminamos)
            setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
            
            setSuccessMsg("Libro eliminado de favoritos");
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setError("No se pudo eliminar el favorito de la base de datos.");
        }
    };

    if (!user) return <div className="home-container loading-container">Cargando perfil...</div>;

    return (
        <div className="home-container">
            <header className="home-header profile-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Mi Perfil 👤</h1>
                    <p>Gestiona tu cuenta y tus libros favoritos.</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary">
                        Editar Datos
                    </button>
                )}
            </header>

            <div className="recent-activity profile-card">
                {error && <div className="error-msg">{error}</div>}
                {successMsg && <div className="success-msg">{successMsg}</div>}

                {!isEditing ? (
                    <div className="profile-info-display">
                        <div className="profile-group">
                            <label className="profile-label">Nombre:</label>
                            <p className="profile-value">{user.nombre}</p>
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Correo Electrónico:</label>
                            <p className="profile-value">{user.mail}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="auth-form">
                        <div className="profile-group">
                            <label className="profile-label">Nombre:</label>
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
                            <label className="profile-label">Email:</label>
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
                                placeholder="Déjalo en blanco para mantener la actual"
                                className="profile-input" 
                            />
                        </div>
                        <div className="profile-actions" style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel" style={{ flex: 1 }}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            {/* SECCIÓN DINÁMICA DE FAVORITOS */}
            <section className="recent-activity" style={{ marginTop: '2rem' }}>
                <h2>⭐ Mis Libros Favoritos</h2>
                <div className="activity-list" style={{ marginTop: '1rem' }}>
                    {favoritos.length > 0 ? (
                        favoritos.map((fav) => (
                            <div key={fav.id} className="activity-item" style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
                                {fav.imagenUrl && (
                                    <img 
                                        src={fav.imagenUrl} 
                                        alt="portada" 
                                        style={{ width: '45px', borderRadius: '4px', marginRight: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0 }}><strong>{fav.titulo}</strong></p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>{fav.autor}</p>
                                </div>
                                <button 
                                    onClick={() => eliminarFavorito(fav.id)} 
                                    className="logout-btn" 
                                    style={{ 
                                        backgroundColor: '#fff5f5', 
                                        color: '#e53e3e', 
                                        border: '1px solid #feb2b2',
                                        padding: '6px 12px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#a0aec0' }}>
                            <p>Aún no has guardado libros en tus favoritos.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PerfilView;