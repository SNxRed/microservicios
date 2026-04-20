package com.biblioteca.biblioteca_comenta.controllers;

import com.biblioteca.biblioteca_comenta.models.ComentarioModel;
import com.biblioteca.biblioteca_comenta.models.PublicacionModel;
import com.biblioteca.biblioteca_comenta.services.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.biblioteca.biblioteca_comenta.models.UsuarioModel;

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

    // Añadir este endpoint a la clase PublicacionController
    @GetMapping("/usuario/{usuarioId}")
    public List<PublicacionModel> obtenerPublicacionesUsuario(@PathVariable Long usuarioId) {
        return publicacionService.obtenerPorUsuario(usuarioId);
    }

    // Añadir este endpoint a la clase PublicacionController
    @PostMapping("/{id}/reacciones")
    public ResponseEntity<?> reaccionar(@PathVariable Long id, @RequestBody UsuarioModel usuario) {
        try {
            publicacionService.alternarReaccion(id, usuario.getId());
            return ResponseEntity.ok("{\"message\": \"Reacción actualizada\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    
}