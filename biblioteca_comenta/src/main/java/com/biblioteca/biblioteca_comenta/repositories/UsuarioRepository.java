package com.biblioteca.biblioteca_comenta.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biblioteca.biblioteca_comenta.models.UsuarioModel;
//import java.util.List;


@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long>{
    // public abstract ArrayList<UsuarioModel> findByuser(String mail, String password);
    boolean existsByMail(String mail); 
    Optional<UsuarioModel> findByMail(String mail);
    Optional<UsuarioModel> findById(Long id);
}
