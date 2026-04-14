import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

const HomeView = () => {
    const [user, setUser] = useState({ nombre: 'Usuario' });
    const [query, setQuery] = useState('');
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(false);

    // Configuración de API (Recuerda que estas variables vienen de tu .env)
    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

    useEffect(() => {
        const fetchUserData = async () => {
            const savedData = JSON.parse(localStorage.getItem('user'));
            if (savedData && savedData.id) {
                try {
                    // Consultamos datos frescos del backend
                    const response = await api.get(`/usuario/${savedData.id}`);
                    setUser(response.data);
                } catch (error) {
                    console.error("Error al obtener datos en el Home", error);
                    setUser(savedData); 
                }
            }
        };
        fetchUserData();
    }, []);

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
                <h1>Bienvenido de nuevo, {user.nombre} 👋</h1>
                <p>Gestiona tu biblioteca personal y descubre nuevas lecturas.</p>
            </header>

            {/* --- SECCIÓN DE BÚSQUEDA RÁPIDA --- */}
            <section className="search-section" style={{ marginBottom: '2rem' }}>
                <form onSubmit={buscarLibros} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar un libro rápidamente..." 
                        className="profile-input" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </section>

            {/* --- RESULTADOS CON IMÁGENES (Si hay búsqueda) --- */}
            {libros.length > 0 && (
                <section className="recent-activity" style={{ marginBottom: '2rem' }}>
                    <h2>Resultados encontrados</h2>
                    <div className="activity-list">
                        {libros.map((item) => (
                            <div key={item.id} className="activity-item" style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="book-cover" style={{ marginRight: '15px' }}>
                                    {item.volumeInfo.imageLinks?.thumbnail ? (
                                        <img 
                                            src={item.volumeInfo.imageLinks.thumbnail} 
                                            alt="portada" 
                                            style={{ width: '50px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '50px', height: '70px', backgroundColor: '#edf2f7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#a0aec0' }}>
                                            N/A
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p><strong>{item.volumeInfo.title}</strong></p>
                                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>
                                        {item.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --- DASHBOARD DE ESTADÍSTICAS --- */}
            <div className="home-grid">
                <div className="stat-card">
                    <h3>Libros Guardados</h3>
                    <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                    <h3>Reseñas Escritas</h3>
                    <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                    <h3>Miembro desde</h3>
                    <p className="stat-number" style={{ fontSize: '1.5rem', marginTop: '10px' }}>2026</p>
                </div>
            </div>

            {/* --- ACTIVIDAD RECIENTE --- */}
            <section className="recent-activity">
                <h2>Actividad de la Comunidad</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span>🚀</span>
                        <p>Bienvenido a la <strong>Biblioteca Comenta</strong>. Comienza explorando libros en el catálogo.</p>
                        <span className="activity-date">Ahora</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeView;