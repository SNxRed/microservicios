import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';
import '../styles/Home.css'; // Importamos el nuevo CSS

const HomeView = () => {
    const [user, setUser] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [comentarioPost, setComentarioPost] = useState('');
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
            nombreUsuario: user.nombre,
            texto: texto
        };

        try {
            await api.post(`/publicaciones/${publicacionId}/comentarios`, comentarioObj);
            setNuevoComentario({ ...nuevoComentario, [publicacionId]: '' });
            fetchPublicaciones();
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
            <section className="publish-section">
                <h2>¿Qué libro quieres recomendar?</h2>
                <form onSubmit={buscarEnGoogle} className="search-form">
                    <input 
                        className="profile-input" 
                        placeholder="Busca el libro por título..." 
                        onChange={(e) => setBusqueda(e.target.value)} 
                    />
                    <button className="btn-primary btn-inline">Buscar</button>
                </form>

                {libroSeleccionado ? (
                    <div className="selected-book-card">
                        <p>Libro: <strong>{libroSeleccionado.volumeInfo.title}</strong></p>
                        <textarea 
                            className="profile-input post-textarea" 
                            placeholder="¿Por qué lo recomiendas?"
                            value={comentarioPost}
                            onChange={(e) => setComentarioPost(e.target.value)}
                        />
                        <div className="button-group">
                            <button onClick={crearPublicacion} className="btn-primary btn-inline">Publicar</button>
                            <button onClick={() => setLibroSeleccionado(null)} className="btn-cancel btn-inline">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="search-results-mini">
                        {resultados.slice(0, 10).map(libro => (
                            <div key={libro.id} onClick={() => setLibroSeleccionado(libro)} className="search-item">
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
                    <div key={post.id} className="post-card">
                        
                        <div className="post-header">
                            <div className="avatar">
                                {post.usuario.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="post-info">
                                <strong>{post.usuario.nombre}</strong>
                                <span>Publicó una recomendación</span>
                            </div>
                        </div>

                        <div className="book-content-block">
                            {post.imagenLibro && (
                                <img src={post.imagenLibro} alt="portada" className="book-cover" />
                            )}
                            <div className="book-details">
                                <h3>{post.tituloLibro}</h3>
                                <p className="user-comment-text">"{post.textoPublicacion}"</p>
                            </div>
                        </div>

                        {/* COMENTARIOS */}
                        <div className="comments-container">
                            <h4>Comentarios</h4>
                            
                            <div className="comments-list">
                                {post.comentarios?.map(c => (
                                    <div key={c.id} className="comment-bubble">
                                        <strong className="comment-user">{c.nombreUsuario}:</strong> {c.texto}
                                    </div>
                                ))}
                            </div>

                            <div className="comment-form">
                                <input 
                                    className="profile-input comment-input" 
                                    placeholder="Escribe un comentario..."
                                    value={nuevoComentario[post.id] || ''}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                />
                                <button 
                                    onClick={() => enviarComentario(post.id)}
                                    className="btn-secondary btn-inline"
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