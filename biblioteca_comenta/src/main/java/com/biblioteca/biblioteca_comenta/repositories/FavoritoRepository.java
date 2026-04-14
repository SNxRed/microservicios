package com.biblioteca.biblioteca_comenta.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biblioteca.biblioteca_comenta.models.FavoritoModel;

@Repository
public interface FavoritoRepository extends JpaRepository<FavoritoModel, Long> {
    // Busca todos los favoritos que pertenecen a un ID de usuario específico
    List<FavoritoModel> findByUsuarioId(Long usuarioId);
    
    // Para evitar duplicados: ¿Ya tiene este libro en favoritos?
    boolean existsByUsuarioIdAndGoogleBookId(Long usuarioId, String googleBookId);
}