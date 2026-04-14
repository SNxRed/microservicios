import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';
import.meta.env
const HomeView = () => {
    const [user, setUser] = useState({ nombre: 'Usuario' });
    const [query, setQuery] = useState(''); // Estado para el texto de búsqueda
    const [libros, setLibros] = useState([]); // Estado para los resultados de la API
    const [loading, setLoading] = useState(false);

    // API Key que proporcionaste (¡Recuerda protegerla luego en un .env!)
    const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

    useEffect(() => {
        const fetchUserData = async () => {
            const savedData = JSON.parse(localStorage.getItem('user'));
            if (savedData && savedData.id) {
                try {
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

    // Función para buscar libros
    const buscarLibros = async (e) => {
    e.preventDefault();
    
    // 1. Obtenemos el valor directamente del estado actual.
    // Si el problema persiste, podemos usar: const valorABuscar = e.target[0].value;
    const valorABuscar = query.trim();

    if (!valorABuscar) return;

    setLoading(true);
    setLibros([]); // Limpiamos resultados anteriores para dar feedback visual
    
    try {
        // 2. Usamos 'valorABuscar' en lugar de confiar solo en la variable 'query' 
        // que podría estar un paso atrás en el renderizado.
        const response = await fetch(`${GOOGLE_BOOKS_API}?q=intitle:${valorABuscar}&key=${API_KEY}`);
        const data = await response.json();
        
        if (data.items) {
            setLibros(data.items);
        } else {
            setLibros([]);
        }
    } catch (error) {
        console.error("Error buscando libros:", error);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenido, {user.nombre} 👋</h1>
                <p>¿Qué libro te gustaría comentar hoy?</p>
            </header>

            {/* --- BARRA DE BÚSQUEDA --- */}
            <section className="search-section" style={{ marginBottom: '2rem' }}>
                <form onSubmit={buscarLibros} style={{ display: 'flex', gap: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar por título" 
                        className="profile-input" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </section>

            {/* --- RESULTADOS DE BÚSQUEDA --- */}
            {libros.length > 0 && (
                <section className="recent-activity" style={{ marginBottom: '2rem' }}>
                    <h2>Resultados encontrados:</h2>
                    <div className="activity-list">
                        {libros.map((item) => (
                            <div key={item.id} className="activity-item">
                                <span>📚</span>
                                <p><strong>{item.volumeInfo.title}</strong></p>
                                <button className="logout-btn" style={{ marginLeft: 'auto' }}>Comentar</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tus estadísticas actuales se mantienen abajo */}
            <div className="home-grid">
                <div className="stat-card">
                    <h3>Mis Libros</h3>
                    <p className="stat-number">12</p>
                </div>
                {/* ... resto de las cards */}
            </div>
        </div>
    );
};

export default HomeView;