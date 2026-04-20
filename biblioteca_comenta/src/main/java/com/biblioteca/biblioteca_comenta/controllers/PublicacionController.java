package com.biblioteca.biblioteca_comenta.controllers;

import com.biblioteca.biblioteca_comenta.models.ComentarioModel;
import com.biblioteca.biblioteca_comenta.models.PublicacionModel;
import com.biblioteca.biblioteca_comenta.services.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    
    @GetMapping //Muro del Home
    public List<PublicacionModel> listarPublicaciones() {
        return publicacionService.obtenerTodas();
    }

    
    @PostMapping //Realizar una nueva publicación
    public ResponseEntity<PublicacionModel> crearPublicacion(@RequestBody PublicacionModel publicacion) {
        return ResponseEntity.ok(publicacionService.guardarPublicacion(publicacion));
    }

    
    @PostMapping("/{id}/comentarios") //Agregar comentario a una publicación específica
    public ResponseEntity<ComentarioModel> comentar(@PathVariable Long id, @RequestBody ComentarioModel comentario) {
        try {
            return ResponseEntity.ok(publicacionService.agregarComentario(id, comentario));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}