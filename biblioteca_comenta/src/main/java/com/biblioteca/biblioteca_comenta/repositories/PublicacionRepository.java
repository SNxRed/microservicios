package com.biblioteca.biblioteca_comenta.repositories;

import com.biblioteca.biblioteca_comenta.models.PublicacionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacionRepository extends JpaRepository<PublicacionModel, Long> {
    // Al extender de JpaRepository, ya tienes métodos como findAll(), save(), etc.
}