package com.biblioteca.biblioteca_comenta.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "comentarios_publicacion")
public class ComentarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreUsuario; // Nombre de quien comenta
    private String texto;

    @ManyToOne
    @JoinColumn(name = "publicacion_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private PublicacionModel publicacion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public PublicacionModel getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(PublicacionModel publicacion) {
        this.publicacion = publicacion;
    }
}