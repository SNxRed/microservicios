import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Home.css';

const HomeView = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [textoPublicacion, setTextoPublicacion] = useState('');
    const [comentarioTexto, setComentarioTexto] = useState({}); // { pubId: 'texto' }
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [isSearching, setIsSearching] = useState(false);
    
    // NUEVO ESTADO: Controla qué publicaciones tienen sus comentarios expandidos
    const [comentariosExpandidos, setComentariosExpandidos] = useState({});

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        cargarPublicaciones();
    }, []);

    const cargarPublicaciones = async () => {
        try {
            const response = await api.get('/publicaciones');
            setPublicaciones(response.data.reverse());
        } catch (error) {
            console.error("Error al cargar muro", error);
        }
    };

    const buscarLibro = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;

        setIsSearching(true);
        try {
            const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
            const url = `https://www.googleapis.com/books/v1/volumes?q=${busqueda}&maxResults=15&fields=items(id,volumeInfo(title,authors,imageLinks/thumbnail))&key=${API_KEY}`;
            
            const resp = await fetch(url);
            const data = await resp.json();
            setResultados(data.items || []);
        } catch (error) {
            console.error("Error API Google", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePublicar = async () => {
        if (!libroSeleccionado || !textoPublicacion.trim()) return;

        const nuevaPublicacion = {
            usuario: { id: user.id },
            googleBookId: libroSeleccionado.id,
            tituloLibro: libroSeleccionado.volumeInfo.title,
            imagenLibro: libroSeleccionado.volumeInfo.imageLinks?.thumbnail || '',
            textoPublicacion: textoPublicacion
        };

        try {
            await api.post('/publicaciones', nuevaPublicacion);
            setLibroSeleccionado(null);
            setTextoPublicacion('');
            setBusqueda('');
            setResultados([]);
            setMensaje({ texto: '¡Publicación compartida!', tipo: 'success' });
            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
            cargarPublicaciones();
        } catch (error) {
            console.error("Error al publicar", error);
        }
    };

    const handleComentar = async (publicacionId) => {
        const texto = comentarioTexto[publicacionId];
        if (!texto?.trim()) return;

        try {
            await api.post(`/publicaciones/${publicacionId}/comentarios`, {
                usuario: { id: user.id }, 
                texto: texto
            });
            
            setComentarioTexto({ ...comentarioTexto, [publicacionId]: '' });
            cargarPublicaciones(); 
        } catch (error) {
            console.error("Error al comentar", error);
        }
    };

    const handleReaccionar = async (publicacionId) => {
        try {
            await api.post(`/publicaciones/${publicacionId}/reacciones`, { id: user.id });
            cargarPublicaciones(); 
        } catch (error) {
            console.error("Error al reaccionar", error);
        }
    };

    // NUEVA FUNCIÓN: Alterna el estado de expansión de los comentarios
    const toggleComentarios = (publicacionId) => {
        setComentariosExpandidos(prev => ({
            ...prev,
            [publicacionId]: !prev[publicacionId]
        }));
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Comunidad Bibliófila 📖</h1>
                <p>Comparte tus lecturas y opiniones con otros lectores.</p>
            </header>

            {mensaje.texto && (
                <div className={`feedback-msg ${mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}`} style={{marginBottom: '20px'}}>
                    {mensaje.texto}
                </div>
            )}

            <section className="publish-section">
                <h2>¿Qué estás leyendo ahora?</h2>
                {!libroSeleccionado ? (
                    <form onSubmit={buscarLibro} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Busca un libro para compartir..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="profile-input"
                        />
                        <button 
                            type="submit" 
                            className="btn-primary btn-inline" 
                            disabled={isSearching}
                        >
                            {isSearching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                ) : (
                    <div className="selected-book-card">
                        <div className="book-content-block" style={{border: 'none', padding: 0}}>
                            <img src={libroSeleccionado.volumeInfo.imageLinks?.thumbnail} alt="cover" className="book-cover" />
                            <div className="book-details">
                                <h3>{libroSeleccionado.volumeInfo.title}</h3>
                                <p>{libroSeleccionado.volumeInfo.authors?.join(', ')}</p>
                            </div>
                        </div>
                        <textarea 
                            className="profile-input post-textarea"
                            placeholder="Escribe tu reseña o comentario sobre este libro..."
                            value={textoPublicacion}
                            onChange={(e) => setTextoPublicacion(e.target.value)}
                        />
                        <div className="button-group">
                            <button onClick={handlePublicar} className="btn-primary">Publicar</button>
                            <button onClick={() => setLibroSeleccionado(null)} className="btn-cancel">Cancelar</button>
                        </div>
                    </div>
                )}

                {resultados.length > 0 && !libroSeleccionado && (
                    <div className="search-results-mini">
                        {resultados.map(libro => (
                            <div 
                                key={libro.id} 
                                className="search-item" 
                                onClick={() => setLibroSeleccionado(libro)}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                                {libro.volumeInfo.imageLinks?.thumbnail ? (
                                    <img 
                                        src={libro.volumeInfo.imageLinks.thumbnail} 
                                        alt="portada" 
                                        style={{ width: '35px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                                    />
                                ) : (
                                    <div style={{ width: '35px', height: '50px', backgroundColor: '#edf2f7', borderRadius: '4px' }}></div>
                                )}
                                <div>
                                    <strong>{libro.volumeInfo.title}</strong>
                                    <p style={{fontSize: '0.8rem', color: '#718096', margin: 0}}>{libro.volumeInfo.authors?.[0]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="feed-container">
                {publicaciones.map(pub => (
                    <article key={pub.id} className="post-card">
                        <div className="post-header">
                            <div className="avatar">{pub.usuario.nombre.charAt(0).toUpperCase()}</div>
                            <div className="post-info">
                                <strong>{pub.usuario.nombre}</strong>
                                <span>Recomendó un libro</span>
                            </div>
                        </div>

                        <div className="book-content-block">
                            {pub.imagenLibro && <img src={pub.imagenLibro} alt="portada" className="book-cover" />}
                            <div className="book-details">
                                <h3>{pub.tituloLibro}</h3>
                                <p className="user-comment-text">"{pub.textoPublicacion}"</p>
                            </div>
                        </div>

                        <div className="post-actions" style={{ display: 'flex', gap: '15px', padding: '10px 0', borderTop: '1px solid #edf2f7', marginTop: '15px' }}>
                            <button 
                                onClick={() => handleReaccionar(pub.id)}
                                style={{ 
                                    background: 'none', border: 'none', cursor: 'pointer', 
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    color: pub.reacciones?.some(r => r.usuario.id === user.id) ? '#e53e3e' : '#718096',
                                    fontWeight: '600'
                                }}
                            >
                                {pub.reacciones?.some(r => r.usuario.id === user.id) ? '❤️' : '🤍'} 
                                {pub.reacciones?.length || 0}
                            </button>
                        </div>

                        {/* --- BLOQUE DE COMENTARIOS ACTUALIZADO --- */}
                        <div className="comments-container">
                            <h4>Comentarios ({pub.comentarios?.length || 0})</h4>
                            
                            {(() => {
                                const comentarios = pub.comentarios || [];
                                const estaExpandido = comentariosExpandidos[pub.id];
                                const comentariosAMostrar = estaExpandido ? comentarios : comentarios.slice(-2);
                                const hayMasComentarios = comentarios.length > 2;

                                return (
                                    <>
                                        {hayMasComentarios && (
                                            <button 
                                                onClick={() => toggleComentarios(pub.id)}
                                                style={{ 
                                                    background: 'none', border: 'none', color: '#3498db', 
                                                    fontSize: '0.85rem', cursor: 'pointer', marginBottom: '10px', 
                                                    padding: 0, fontWeight: '500' 
                                                }}
                                            >
                                                {estaExpandido ? 'Ocultar comentarios anteriores' : `Ver los ${comentarios.length - 2} comentarios anteriores`}
                                            </button>
                                        )}

                                        {comentariosAMostrar.map(com => (
                                            <div key={com.id} className="comment-bubble">
                                                <strong className="comment-user">{com.usuario?.nombre || 'Usuario'}:</strong> 
                                                {com.texto}
                                            </div>
                                        ))}
                                    </>
                                );
                            })()}

                            <div className="comment-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginTop: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Escribe un comentario..."
                                        className="profile-input comment-input"
                                        value={comentarioTexto[pub.id] || ''}
                                        onChange={(e) => {
                                            const nuevoTexto = e.target.value;
                                            const caracteresSinEspacio = nuevoTexto.replace(/\s/g, '').length;
                                            if (caracteresSinEspacio <= 255) {
                                                setComentarioTexto({
                                                    ...comentarioTexto,
                                                    [pub.id]: nuevoTexto
                                                });
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={() => handleComentar(pub.id)}
                                        className="btn-primary btn-small"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <span style={{ 
                                    fontSize: '0.8rem', 
                                    color: (255 - (comentarioTexto[pub.id] || '').replace(/\s/g, '').length) === 0 ? '#e53e3e' : '#718096',
                                    fontWeight: (255 - (comentarioTexto[pub.id] || '').replace(/\s/g, '').length) <= 20 ? 'bold' : '500'
                                }}>
                                    {255 - (comentarioTexto[pub.id] || '').replace(/\s/g, '').length} disponibles
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default HomeView;