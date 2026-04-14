package com.biblioteca.biblioteca_comenta.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biblioteca.biblioteca_comenta.models.FavoritoModel;
import com.biblioteca.biblioteca_comenta.repositories.FavoritoRepository;

@Service
public class FavoritoService {
    @Autowired
    FavoritoRepository favoritoRepository;

    public FavoritoModel agregarAFavoritos(FavoritoModel favorito) {
        if(favoritoRepository.existsByUsuarioIdAndGoogleBookId(
            favorito.getUsuario().getId(), favorito.getGoogleBookId())) {
            throw new RuntimeException("El libro ya está en tus favoritos");
        }
        return favoritoRepository.save(favorito);
    }

    public List<FavoritoModel> obtenerFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId);
    }
}