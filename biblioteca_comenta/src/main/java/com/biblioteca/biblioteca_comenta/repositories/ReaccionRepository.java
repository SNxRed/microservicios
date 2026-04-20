package com.biblioteca.biblioteca_comenta.repositories;

import com.biblioteca.biblioteca_comenta.models.ReaccionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReaccionRepository extends JpaRepository<ReaccionModel, Long> {
    // Busca si existe una reacción de un usuario en un post específico
    Optional<ReaccionModel> findByUsuarioIdAndPublicacionId(Long usuarioId, Long publicacionId);
}