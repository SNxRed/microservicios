import axios from 'axios';

const API_URL = 'http://localhost:8080/usuario';

export const register = async (nombre, mail, password) => {
    // Esta es la petición POST que mencionaste
    return await axios.post(API_URL, { nombre, mail, password });
};

export const login = async (mail, password) => {
    // Nota: Aquí asumo que tu API maneja el login en una ruta similar o mediante POST
    // Si aún no tienes el endpoint de login, esto es un ejemplo:
    return await axios.post(`${API_URL}/login`, { mail, password });
};