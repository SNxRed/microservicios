import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

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
            const response = await fetch(`${GOOGLE_BOOKS_API}?q=intitle:${valorABuscar}&key=${API_KEY}`);
            const data = await response.json();
            setLibros(data.items || []);
        } catch (error) {
            console.error("Error buscando libros:", error);
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
                <div className={mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}>
                    {mensaje.texto}
                </div>
            )}

            <section className="search-section" style={{ marginBottom: '2rem' }}>
                <form onSubmit={buscarLibros} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Escribe el título de un libro..." 
                        className="profile-input" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </section>

            <div className="recent-activity">
                <h2>{libros.length > 0 ? "Resultados" : "Resultados de búsqueda"}</h2>
                <div className="activity-list">
                    {libros.map((item) => (
                        <div key={item.id} className="activity-item">
                            {item.volumeInfo.imageLinks?.thumbnail && (
                                <img src={item.volumeInfo.imageLinks.thumbnail} alt="portada" style={{ width: '45px', borderRadius: '4px', marginRight: '15px' }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <p><strong>{item.volumeInfo.title}</strong></p>
                                <p style={{ fontSize: '0.8rem', color: '#718096' }}>
                                    {item.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                                </p>
                            </div>
                            <button onClick={() => agregarAFavoritos(item)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                                ⭐ Favorito
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuscarLibrosView;