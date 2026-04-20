import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';
import '../styles/BuscarLibros.css'; // Importación del nuevo CSS

const BuscarLibrosView = () => {
    const [query, setQuery] = useState('');
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

    const buscarLibros = async (e) => {
        e.preventDefault();
        const valorABuscar = query.trim();
        if (!valorABuscar) return;

        setLoading(true);
        setMensaje({ texto: '', tipo: '' });
        try {
            // Buscamos específicamente por título para mejores resultados
            const response = await fetch(`${GOOGLE_BOOKS_API}?q=${valorABuscar}&maxResults=30&key=${API_KEY}`);
            const data = await response.json();
            setLibros(data.items || []);
        } catch (error) {
            console.error("Error buscando libros:", error);
            setMensaje({ texto: 'Error de conexión con la API', tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const agregarAFavoritos = async (libro) => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const nuevoFavorito = {
            usuario: { id: user.id }, 
            googleBookId: libro.id,
            titulo: libro.volumeInfo.title,
            autor: libro.volumeInfo.authors?.join(', ') || 'Autor desconocido',
            imagenUrl: libro.volumeInfo.imageLinks?.thumbnail || ''
        };

        try {
            await api.post('/favoritos/agregar', nuevoFavorito);
            setMensaje({ texto: `¡"${libro.volumeInfo.title}" añadido a favoritos!`, tipo: 'success' });
            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
        } catch (error) {
            setMensaje({ 
                texto: error.response?.data?.message || "Error al añadir a favoritos", 
                tipo: 'error' 
            });
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Explorar Catálogo 🔍</h1>
                <p>Encuentra libros y guárdalos en tu lista personal.</p>
            </header>

            {mensaje.texto && (
                <div className={`feedback-msg ${mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}`}>
                    {mensaje.texto}
                </div>
            )}

            <section className="search-container">
                <form onSubmit={buscarLibros} className="search-form-group">
                    <input 
                        type="text" 
                        placeholder="Escribe el título de un libro..." 
                        className="profile-input" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary btn-inline" disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </section>

            <div className="recent-activity">
                <h2 className="favorites-title">
                    {libros.length > 0 ? `Resultados (${libros.length})` : "Resultados de búsqueda"}
                </h2>
                
                <div className="results-grid">
                    {libros.map((item) => (
                        <div key={item.id} className="book-card">
                            {item.volumeInfo.imageLinks?.thumbnail ? (
                                <img src={item.volumeInfo.imageLinks.thumbnail} alt="portada" className="book-thumb" />
                            ) : (
                                <div className="fav-placeholder book-thumb"></div>
                            )}
                            
                            <div className="book-info">
                                <strong>{item.volumeInfo.title}</strong>
                                <span className="book-author">
                                    {item.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                                </span>
                            </div>

                            <button 
                                onClick={() => agregarAFavoritos(item)} 
                                className="btn-fav"
                                title="Agregar a favoritos"
                            >
                                ⭐
                            </button>
                        </div>
                    ))}
                </div>

                {libros.length === 0 && !loading && (
                    <div className="empty-state">
                        <p>Usa el buscador para explorar miles de libros de Google Books.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuscarLibrosView;