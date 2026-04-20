package com.biblioteca.biblioteca_comenta.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // IMPORTANTE
import org.springframework.stereotype.Service;

import com.biblioteca.biblioteca_comenta.models.UsuarioModel;
import com.biblioteca.biblioteca_comenta.repositories.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el hasheador

    public ArrayList<UsuarioModel> obtenerUsuarios(){
        return (ArrayList<UsuarioModel>) usuarioRepository.findAll();
    }

    public UsuarioModel guardarUsuario(UsuarioModel usuario){ 
        if(usuarioRepository.existsByMail(usuario.getMail())){
            throw new RuntimeException("El Correo ya esta registrado");
        }
        
        // Hasheamos la contraseña antes de guardar en la BD
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public UsuarioModel login(String mail, String password){
        // 1. Buscamos al usuario solo por su correo
        Optional<UsuarioModel> usuarioOpt = usuarioRepository.findByMail(mail);
        
        if(usuarioOpt.isPresent()){
            UsuarioModel usuario = usuarioOpt.get();
            // 2. Comparamos la contraseña plana con el hash de la BD usando "matches"
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                return usuario;
            }
        }
        // Si el correo no existe o la contraseña no hace "match", lanzamos error
        throw new RuntimeException("Credenciales incorrectas");
    }

    public UsuarioModel obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));
    }

    public UsuarioModel actualizarUsuario(Long id, UsuarioModel usuarioActualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            
            if (!usuario.getMail().equals(usuarioActualizado.getMail())) {
                if (usuarioRepository.existsByMail(usuarioActualizado.getMail())) {
                    throw new RuntimeException("El correo ingresado ya está en uso por otro usuario.");
                }
            }

            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setMail(usuarioActualizado.getMail());
            
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                // Si el usuario envía una contraseña nueva al actualizar, también la hasheamos
                usuario.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
            }

            return usuarioRepository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));
    }
}