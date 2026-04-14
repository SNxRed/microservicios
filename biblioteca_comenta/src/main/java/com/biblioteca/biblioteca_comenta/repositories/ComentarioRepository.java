package com.biblioteca.biblioteca_comenta.repositories;

import com.biblioteca.biblioteca_comenta.models.ComentarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<ComentarioModel, Long> {
    // Aquí se guardarán las interacciones (comentarios) de cada post.
}