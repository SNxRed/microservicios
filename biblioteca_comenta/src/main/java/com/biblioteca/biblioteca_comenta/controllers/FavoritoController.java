package com.biblioteca.biblioteca_comenta.controllers;

import com.biblioteca.biblioteca_comenta.models.FavoritoModel;
import com.biblioteca.biblioteca_comenta.models.UsuarioModel;
import com.biblioteca.biblioteca_comenta.services.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    // Guardar un favorito
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarFavorito(@RequestBody FavoritoModel favorito) {
        try {
            FavoritoModel nuevoFavorito = favoritoService.agregarAFavoritos(favorito);
            return ResponseEntity.ok(nuevoFavorito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    // Obtener favoritos de un usuario específico
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FavoritoModel>> obtenerFavoritos(@PathVariable Long usuarioId) {
        List<FavoritoModel> favoritos = favoritoService.obtenerFavoritosPorUsuario(usuarioId);
        return ResponseEntity.ok(favoritos);
    }
}