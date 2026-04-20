package com.biblioteca.biblioteca_comenta.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "reacciones_publicacion")
public class ReaccionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel usuario;

    @ManyToOne
    @JoinColumn(name = "publicacion_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private PublicacionModel publicacion;

    // Getters y Setters
    public Long getId(){
        return id; 
    }

    public void setId(Long id){
        this.id = id; 
    }

    public UsuarioModel getUsuario(){
        return usuario; 
    }

    public void setUsuario(UsuarioModel usuario){
        this.usuario = usuario; 
    }

    public PublicacionModel getPublicacion(){
        return publicacion; 
    }

    public void setPublicacion(PublicacionModel publicacion){
        this.publicacion = publicacion; 
    }
}