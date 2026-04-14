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
                    // 1. Cargar datos del usuario
                    const userResponse = await api.get(`/usuario/${localUser.id}`);
                    setUser(userResponse.data);
                    setEditData({ nombre: userResponse.data.nombre, mail: userResponse.data.mail, password: '' });
                    
                    // 2. Cargar sus favoritos
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
            setSuccessMsg("¡Perfil actualizado con éxito!");
            setIsEditing(false);
            setEditData({ ...editData, password: '' });
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Hubo un error al actualizar.");
        }
    };

    if (!user) return <div className="home-container loading-container">Cargando perfil...</div>;

    return (
        <div className="home-container">
            <header className="home-header profile-header-flex">
                <div>
                    <h1>Mi Perfil 👤</h1>
                    <p>Gestiona tu información y tus libros guardados.</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary">Editar Perfil</button>
                )}
            </header>

            <div className="recent-activity profile-card">
                {error && <div className="error-msg">{error}</div>}
                {successMsg && <div className="success-msg">{successMsg}</div>}

                {!isEditing ? (
                    <>
                        <div className="profile-group"><label className="profile-label">Nombre:</label><p className="profile-value">{user.nombre}</p></div>
                        <div className="profile-group"><label className="profile-label">Email:</label><p className="profile-value">{user.mail}</p></div>
                    </>
                ) : (
                    <form onSubmit={handleSave} className="auth-form">
                        <div className="profile-group">
                            <label className="profile-label">Nombre:</label>
                            <input type="text" name="nombre" value={editData.nombre} onChange={handleChange} required className="profile-input" />
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Email:</label>
                            <input type="email" name="mail" value={editData.mail} onChange={handleChange} required className="profile-input" />
                        </div>
                        <div className="profile-group">
                            <label className="profile-label">Nueva Contraseña (Opcional):</label>
                            <input type="password" name="password" value={editData.password} onChange={handleChange} className="profile-input" />
                        </div>
                        <div className="profile-actions">
                            <button type="submit" className="btn-primary">Guardar</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            {/* SECCIÓN DE FAVORITOS */}
            <section className="recent-activity" style={{ marginTop: '2rem' }}>
                <h2>⭐ Mis Libros Favoritos</h2>
                <div className="activity-list" style={{ marginTop: '1rem' }}>
                    {favoritos.length > 0 ? (
                        favoritos.map((fav) => (
                            <div key={fav.id} className="activity-item">
                                {fav.imagenUrl && <img src={fav.imagenUrl} alt="portada" style={{ width: '40px', borderRadius: '4px', marginRight: '15px' }} />}
                                <div style={{ flex: 1 }}>
                                    <p><strong>{fav.titulo}</strong></p>
                                    <p style={{ fontSize: '0.85rem', color: '#718096' }}>{fav.autor}</p>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#cbd5e0' }}>Guardado</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>Aún no has guardado libros favoritos.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PerfilView;