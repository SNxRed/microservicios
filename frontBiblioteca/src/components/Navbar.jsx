import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/'); 
        window.location.reload(); 
    };

    if (!user) return null;

    return (
        <nav className="main-navbar">
            <div className="nav-brand">
                <span className="logo-icon">📚</span>
                <span className="nav-logo">BiblioApp</span>
            </div>
            
            {/* Aquí están los botones de navegación */}
            <div className="nav-links">
                <Link to="/home" className="nav-item">Inicio</Link>
                <Link to="/buscar" className='nav-item'>Buscar Libros</Link>
                <Link to="/perfil" className="nav-item">Mi Perfil</Link>
            </div>

            <div className="nav-user-section">
                <div className="user-avatar">{user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}</div>
                <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;