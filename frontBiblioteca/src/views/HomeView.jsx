import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Layout.css';

const HomeView = () => {
    const [user, setUser] = useState({ nombre: 'Usuario' });

    useEffect(() => {
        const fetchUserData = async () => {
            const savedData = JSON.parse(localStorage.getItem('user'));
            
            if (savedData && savedData.id) {
                try {
                    // Consultamos a la base de datos usando el ID
                    const response = await api.get(`/${savedData.id}`);
                    setUser(response.data);
                } catch (error) {
                    console.error("Error al obtener datos en el Home", error);
                    // Fallback: si falla la BD, usamos lo que haya en localStorage
                    setUser(savedData); 
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenido, {user.nombre} 👋</h1>
                <p>¿Qué te gustaría hacer hoy en la Biblioteca Comenta?</p>
            </header>

            {/* El resto de tu código de HomeView se mantiene igual */}
            <div className="home-grid">
                <div className="stat-card">
                    <h3>Mis Libros</h3>
                    <p className="stat-number">12</p>
                </div>
                <div className="stat-card">
                    <h3>Comentarios</h3>
                    <p className="stat-number">24</p>
                </div>
                <div className="stat-card">
                    <h3>Favoritos</h3>
                    <p className="stat-number">5</p>
                </div>
            </div>

            <section className="recent-activity">
                <h2>Actividad Reciente</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span>📖</span>
                        <p>Has añadido <strong>"Clean Code"</strong> a tu lista de lectura.</p>
                        <span className="activity-date">Hace 2 horas</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeView;