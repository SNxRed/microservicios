package com.biblioteca.biblioteca_comenta.services;

import com.biblioteca.biblioteca_comenta.models.ComentarioModel;
import com.biblioteca.biblioteca_comenta.models.PublicacionModel;
import com.biblioteca.biblioteca_comenta.repositories.ComentarioRepository;
import com.biblioteca.biblioteca_comenta.repositories.PublicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublicacionService {

    @Autowired
    private PublicacionRepository publicacionRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

    // Obtener todas las publicaciones para el muro global
    public List<PublicacionModel> obtenerTodas() {
        // Podrías usar Sort.by(Sort.Direction.DESC, "id") para ver las más nuevas primero
        return publicacionRepository.findAll();
    }

    // Guardar una nueva publicación de libro
    public PublicacionModel guardarPublicacion(PublicacionModel publicacion) {
        return publicacionRepository.save(publicacion);
    }

    // Agregar un comentario a una publicación existente
    public ComentarioModel agregarComentario(Long publicacionId, ComentarioModel comentario) {
        return publicacionRepository.findById(publicacionId).map(publicacion -> {
            comentario.setPublicacion(publicacion);
            return comentarioRepository.save(comentario);
        }).orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
    }

    // Añadir este método a la clase PublicacionService
    public List<PublicacionModel> obtenerPorUsuario(Long usuarioId) {
        return publicacionRepository.findByUsuarioId(usuarioId);
    }
}