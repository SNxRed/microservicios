import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';
import '../styles/Perfil.css';
import '../styles/Home.css'; // Reutilizamos estilos del muro para las publicaciones

const PerfilView = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ 
        nombre: user.nombre, 
        mail: user.mail, 
        password: '' 
    });
    const [favorites, setFavorites] = useState([]);
    const [misPublicaciones, setMisPublicaciones] = useState([]); // Estado para las publicaciones
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        cargarDatosPerfil();
    }, []);

    const cargarDatosPerfil = async () => {
        try {
            // Cargar Favoritos
            const favRes = await api.get(`/favoritos/usuario/${user.id}`);
            setFavorites(favRes.data);

            // Cargar Publicaciones del Usuario
            const pubRes = await api.get(`/publicaciones/usuario/${user.id}`);
            setMisPublicaciones(pubRes.data);
        } catch (error) {
            console.error("Error al cargar datos del perfil:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/usuario/${user.id}`, formData);
            const updatedUser = response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditMode(false);
            setMensaje({ texto: "Perfil actualizado correctamente", tipo: 'success' });
        } catch (error) {
            setMensaje({ texto: error.response?.data?.message || "Error al actualizar", tipo: 'error' });
        }
    };

    const eliminarFavorito = async (id) => {
        try {
            await api.delete(`/favoritos/${id}`);
            setFavorites(favorites.filter(f => f.id !== id));
        } catch (error) {
            setMensaje({ texto: "No se pudo eliminar el favorito", tipo: 'error' });
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Mi Panel de Lector 📚</h1>
                <p>Gestiona tu cuenta, tus libros favoritos y tus publicaciones.</p>
            </header>

            {mensaje.texto && (
                <div className={mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}>
                    {mensaje.texto}
                </div>
            )}

            <div className="profile-layout">
                {/* Columna Izquierda: Datos del Usuario */}
                <aside className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <h2>Mis Datos</h2>
                            {!editMode && (
                                <button onClick={() => setEditMode(true)} className="btn-primary btn-small">Editar</button>
                            )}
                        </div>

                        {!editMode ? (
                            <div className="profile-info-display">
                                <div className="profile-group">
                                    <label className="profile-label">Nombre</label>
                                    <p className="profile-value">{user.nombre}</p>
                                </div>
                                <div className="profile-group">
                                    <label className="profile-label">Correo</label>
                                    <p className="profile-value">{user.mail}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="edit-form-group">
                                <input 
                                    className="profile-input"
                                    value={formData.nombre}
                                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    placeholder="Nombre"
                                    required
                                />
                                <input 
                                    className="profile-input"
                                    type="email"
                                    value={formData.mail}
                                    onChange={e => setFormData({...formData, mail: e.target.value})}
                                    placeholder="Correo"
                                    required
                                />
                                <input 
                                    className="profile-input"
                                    type="password"
                                    placeholder="Nueva contraseña (opcional)"
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                                <div className="profile-actions">
                                    <button type="submit" className="btn-primary btn-save">Guardar</button>
                                    <button type="button" onClick={() => setEditMode(false)} className="btn-cancel">Cancelar</button>
                                </div>
                            </form>
                        )}
                    </div>
                </aside>

                {/* Columna Derecha: Favoritos y Publicaciones */}
                <main className="profile-main">
                    <section className="favorites-section">
                        <h2 className="favorites-title">Libros Favoritos ({favorites.length})</h2>
                        {favorites.length > 0 ? (
                            <div className="fav-list">
                                {favorites.map(fav => (
                                    <div key={fav.id} className="fav-item">
                                        <img src={fav.imagenUrl} alt="portada" className="fav-cover" />
                                        <div className="fav-info">
                                            <h3 className="fav-title">{fav.titulo}</h3>
                                            <p className="fav-author">{fav.autor}</p>
                                        </div>
                                        <button onClick={() => eliminarFavorito(fav.id)} className="btn-remove">Quitar</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Aún no tienes libros favoritos.</p>
                            </div>
                        )}
                    </section>

                    {/* Nueva Sección: Mis Publicaciones */}
                    <section className="my-posts-section" style={{marginTop: '40px'}}>
                        <h2 className="favorites-title">Mis Publicaciones ({misPublicaciones.length})</h2>
                        <div className="feed-container">
                            {misPublicaciones.length > 0 ? (
                                misPublicaciones.map(pub => (
                                    <article key={pub.id} className="post-card">
                                        <div className="book-content-block">
                                            {pub.imagenLibro && <img src={pub.imagenLibro} alt="portada" className="book-cover" />}
                                            <div className="book-details">
                                                <h3>{pub.tituloLibro}</h3>
                                                <p className="user-comment-text">"{pub.textoPublicacion}"</p>
                                            </div>
                                        </div>

                                        <div className="comments-container">
                                            <h4>Comentarios ({pub.comentarios?.length || 0})</h4>
                                            {pub.comentarios?.map(com => (
                                                <div key={com.id} className="comment-bubble">
                                                    <strong className="comment-user">{com.usuario?.nombre || 'Usuario'}:</strong> 
                                                    {com.texto}
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>No has realizado ninguna publicación todavía.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PerfilView;