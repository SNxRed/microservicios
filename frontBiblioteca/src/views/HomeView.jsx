import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

const HomeView = () => {
    const [user, setUser] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [comentarioPost, setComentarioPost] = useState('');
    
    // Estado para manejar el texto de los comentarios nuevos en cada post
    const [nuevoComentario, setNuevoComentario] = useState({});

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        setUser(data);
        fetchPublicaciones();
    }, []);

    const fetchPublicaciones = async () => {
        try {
            const res = await api.get('/publicaciones');
            setPublicaciones(res.data);
        } catch (error) {
            console.error("Error al cargar el muro", error);
        }
    };

    const buscarEnGoogle = async (e) => {
        e.preventDefault();
        const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${busqueda}&key=${API_KEY}`);
        const data = await res.json();
        setResultados(data.items || []);
    };

    const crearPublicacion = async () => {
        if (!comentarioPost.trim()) return;
        const nuevaPost = {
            usuario: { id: user.id },
            googleBookId: libroSeleccionado.id,
            tituloLibro: libroSeleccionado.volumeInfo.title,
            imagenLibro: libroSeleccionado.volumeInfo.imageLinks?.thumbnail,
            textoPublicacion: comentarioPost
        };
        await api.post('/publicaciones', nuevaPost);
        setLibroSeleccionado(null);
        setComentarioPost('');
        setResultados([]);
        fetchPublicaciones();
    };

    const enviarComentario = async (publicacionId) => {
        const texto = nuevoComentario[publicacionId];
        if (!texto || !texto.trim()) return;

        const comentarioObj = {
            nombreUsuario: user.nombre, // Usamos el nombre del usuario logueado
            texto: texto
        };

        try {
            await api.post(`/publicaciones/${publicacionId}/comentarios`, comentarioObj);
            // Limpiar el input de ese post específico
            setNuevoComentario({ ...nuevoComentario, [publicacionId]: '' });
            fetchPublicaciones(); // Recargar para ver el comentario
        } catch (error) {
            console.error("Error al comentar", error);
        }
    };

    const handleCommentChange = (publicacionId, value) => {
        setNuevoComentario({
            ...nuevoComentario,
            [publicacionId]: value
        });
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Muro de la Comunidad 🌐</h1>
                <p>Descubre qué están leyendo otros y comparte tus opiniones.</p>
            </header>

            {/* SECCIÓN: CREAR PUBLICACIÓN */}
            <section className="recent-activity" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>¿Qué libro quieres recomendar?</h2>
                <form onSubmit={buscarEnGoogle} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input 
                        className="profile-input" 
                        placeholder="Busca el libro por título..." 
                        onChange={(e) => setBusqueda(e.target.value)} 
                    />
                    <button className="btn-primary" style={{ width: 'auto' }}>Buscar</button>
                </form>

                {libroSeleccionado ? (
                    <div style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', background: '#ebf8ff' }}>
                        <p>Libro: <strong>{libroSeleccionado.volumeInfo.title}</strong></p>
                        <textarea 
                            className="profile-input" 
                            placeholder="¿Por qué lo recomiendas?"
                            value={comentarioPost}
                            onChange={(e) => setComentarioPost(e.target.value)}
                            style={{ marginTop: '10px', minHeight: '60px' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={crearPublicacion} className="btn-primary" style={{ width: 'auto', marginRight: '10px' }}>Publicar</button>
                            <button onClick={() => setLibroSeleccionado(null)} className="btn-cancel" style={{ width: 'auto' }}>Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="activity-list">
                        {resultados.slice(0, 3).map(libro => (
                            <div key={libro.id} onClick={() => setLibroSeleccionado(libro)} className="activity-item" style={{ cursor: 'pointer', border: '1px dashed #cbd5e0' }}>
                                <span>📖</span>
                                <p><strong>{libro.volumeInfo.title}</strong> - <small>Click para seleccionar</small></p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* SECCIÓN: FEED DE PUBLICACIONES */}
            <div className="feed-container">
                {publicaciones.slice().reverse().map(post => (
                    <div key={post.id} className="recent-activity" style={{ marginBottom: '30px', border: '1px solid #edf2f7' }}>
                        {/* Cabecera del Post */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <div className="user-avatar" style={{ background: '#2c3e50' }}>
                                {post.usuario.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ marginLeft: '12px' }}>
                                <strong style={{ color: '#2d3748' }}>{post.usuario.nombre}</strong>
                                <p style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Publicó una recomendación</p>
                            </div>
                        </div>

                        {/* Contenido del Libro */}
                        <div style={{ display: 'flex', background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                            {post.imagenLibro && (
                                <img src={post.imagenLibro} alt="portada" style={{ width: '50px', height: '75px', borderRadius: '4px', marginRight: '15px', objectFit: 'cover' }} />
                            )}
                            <div>
                                <h3 style={{ fontSize: '1rem', margin: 0 }}>{post.tituloLibro}</h3>
                                <p style={{ marginTop: '8px', color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                    "{post.textoPublicacion}"
                                </p>
                            </div>
                        </div>

                        {/* --- PARTE DE COMENTARIOS --- */}
                        <div className="comments-section" style={{ marginTop: '20px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '10px' }}>Comentarios</h4>
                            
                            {/* Lista de Comentarios Existentes */}
                            <div className="comments-list">
                                {post.comentarios?.map(c => (
                                    <div key={c.id} style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <strong style={{ color: '#3498db' }}>{c.nombreUsuario}:</strong> {c.texto}
                                    </div>
                                ))}
                            </div>

                            {/* Formulario para comentar */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <input 
                                    className="profile-input" 
                                    style={{ padding: '8px', fontSize: '0.85rem' }}
                                    placeholder="Escribe un comentario..."
                                    value={nuevoComentario[post.id] || ''}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                />
                                <button 
                                    onClick={() => enviarComentario(post.id)}
                                    className="btn-secondary" 
                                    style={{ width: 'auto', padding: '0 15px' }}
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeView;