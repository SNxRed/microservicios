package com.biblioteca.biblioteca_comenta.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biblioteca.biblioteca_comenta.models.UsuarioModel;
import com.biblioteca.biblioteca_comenta.repositories.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    public ArrayList<UsuarioModel> obtenerUsuarios(){
        return (ArrayList<UsuarioModel>) usuarioRepository.findAll();
    }

    public UsuarioModel guardarUsuario(UsuarioModel usuario){ // verifica si el usuario ya esta registrado
        if(usuarioRepository.existsByMail(usuario.getMail())){
            throw new RuntimeException("El Correo ya esta registrado");
        }
        return usuarioRepository.save(usuario);
    }

    public UsuarioModel login(String mail, String password){
        Optional<UsuarioModel> usuario = usuarioRepository.findByMailAndPassword(mail, password);
        if(usuario.isPresent()){
            return usuario.get();
        }else{
            throw new RuntimeException("Credenciales incorrectas");
        }

    }

    public UsuarioModel obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));
    }

    // Nuevo método para actualizar datos del usuario
    public UsuarioModel actualizarUsuario(Long id, UsuarioModel usuarioActualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            
            // 1. VALIDACIÓN ESTRICTA DE CORREO:
            // Verificamos si el correo que envían es diferente al que ya tiene el usuario actualmente
            if (!usuario.getMail().equals(usuarioActualizado.getMail())) {
                // Si es diferente, verificamos en la base de datos si alguien más ya lo está usando
                if (usuarioRepository.existsByMail(usuarioActualizado.getMail())) {
                    throw new RuntimeException("El correo ingresado ya está en uso por otro usuario.");
                }
            }

            // 2. Si pasa la validación, actualizamos los datos
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setMail(usuarioActualizado.getMail());
            
            // Solo actualizamos la contraseña si el usuario escribió una nueva
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                usuario.setPassword(usuarioActualizado.getPassword());
            }

            return usuarioRepository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));
    }
}
