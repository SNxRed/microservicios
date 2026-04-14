import React, { useState } from 'react';
import '../styles/Layout.css';

const BuscarLibrosView = () => {
    const [query, setQuery] = useState('');
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

    const buscarLibros = async (e) => {
        e.preventDefault();
        const valorABuscar = query.trim();
        if (!valorABuscar) return;

        setLoading(true);
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

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Explorar Catálogo 🔍</h1>
                <p>Encuentra libros en la base de datos de Google para comentar.</p>
            </header>

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
                <h2>{libros.length > 0 ? "Resultados de búsqueda" : "Empieza a buscar para ver resultados"}</h2>
                <div className="activity-list">
                    {libros.map((item) => (
                        <div key={item.id} className="activity-item">
                            <span>📖</span>
                            <div style={{ flex: 1 }}>
                                <p><strong>{item.volumeInfo.title}</strong></p>
                                <p style={{ fontSize: '0.8rem', color: '#718096' }}>
                                    {item.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                                </p>
                            </div>
                            <button className="logout-btn">Comentar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuscarLibrosView;