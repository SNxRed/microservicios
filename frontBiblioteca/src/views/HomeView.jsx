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
        try {
            const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
            const resp = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${busqueda}&maxResults=15&key=${API_KEY}`);
            const data = await resp.json();
            setResultados(data.items || []);
        } catch (error) {
            console.error("Error API Google", error);
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
            cargarPublicaciones();
        } catch (error) {
            console.error("Error al publicar", error);
        }
    };

    const handleComentar = async (publicacionId) => {
        const texto = comentarioTexto[publicacionId];
        if (!texto?.trim()) return;

        try {
            // CAMBIO: Ahora enviamos el objeto usuario con su ID para mantener la relación
            await api.post(`/publicaciones/${publicacionId}/comentarios`, {
                usuario: { id: user.id }, 
                texto: texto
            });
            
            setComentarioTexto({ ...comentarioTexto, [publicacionId]: '' });
            cargarPublicaciones(); // Recargar para ver el nuevo comentario
        } catch (error) {
            console.error("Error al comentar", error);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Comunidad Bibliófila 📖</h1>
                <p>Comparte tus lecturas y opiniones con otros lectores.</p>
            </header>

            {/* Sección para crear publicación */}
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
                        <button type="submit" className="btn-primary btn-inline">Buscar</button>
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

                {/* ✅ CÓMO DEBE QUEDAR AHORA */}
                {resultados.length > 0 && !libroSeleccionado && (
                    <div className="search-results-mini">
                        {resultados.map(libro => (
                            <div 
                                key={libro.id} 
                                className="search-item" 
                                onClick={() => setLibroSeleccionado(libro)}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                                {/* Renderizamos la imagen si existe, sino un cuadro gris de reemplazo */}
                                {libro.volumeInfo.imageLinks?.thumbnail ? (
                                    <img 
                                        src={libro.volumeInfo.imageLinks.thumbnail} 
                                        alt="portada" 
                                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                                    />
                                ) : (
                                    <div style={{ width: '40px', height: '60px', backgroundColor: '#edf2f7', borderRadius: '4px' }}></div>
                                )}
                                
                                {/* Contenedor para el texto alineado verticalmente */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>{libro.volumeInfo.title}</strong>
                                    <span style={{ fontSize: '0.85rem', color: '#718096', marginTop: '2px' }}>
                                        {libro.volumeInfo.authors?.[0] || 'Autor desconocido'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Muro de publicaciones */}
            <div className="feed-container">
                {publicaciones.map(pub => (
                    <article key={pub.id} className="post-card">
                        <div className="post-header">
                            <div className="avatar">{pub.usuario.nombre.charAt(0).toUpperCase()}</div>
                            <div className="post-info">
                                <strong>{pub.usuario.nombre}</strong>
                                <span>Publicó una recomendación</span>
                            </div>
                        </div>

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
                                    {/* CAMBIO: Ahora accedemos al nombre a través de la relación usuario */}
                                    <strong className="comment-user">{com.usuario?.nombre || 'Usuario'}:</strong> 
                                    {com.texto}
                                </div>
                            ))}

                            <div className="comment-form">
                                <input 
                                    type="text" 
                                    placeholder="Escribe un comentario..."
                                    className="profile-input comment-input"
                                    value={comentarioTexto[pub.id] || ''}
                                    onChange={(e) => setComentarioTexto({
                                        ...comentarioTexto,
                                        [pub.id]: e.target.value
                                    })}
                                />
                                <button 
                                    onClick={() => handleComentar(pub.id)}
                                    className="btn-primary btn-small"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default HomeView;