import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeView from './views/WelcomeView';
import HomeView from './views/HomeView';
import PerfilView from './views/PerfilView'; // <- Nueva importación
import Navbar from './components/Navbar';
import BuscarLibrosView from './views/BuscarLibrosView';

function App() {
  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? <WelcomeView /> : <Navigate to="/home" />
        } />
        
        {/* Rutas Protegidas */}
        <Route path="/home" element={
          isAuthenticated ? <HomeView /> : <Navigate to="/" />
        } />
        
        {/* Nueva Ruta de Perfil */}
        <Route path="/perfil" element={
          isAuthenticated ? <PerfilView /> : <Navigate to="/" />
        } />

        <Route path='/buscar' element={
          isAuthenticated ? <BuscarLibrosView /> : <Navigate to="/" />
        }/>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;