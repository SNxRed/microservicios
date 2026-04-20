package com.biblioteca.biblioteca_comenta.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "publicaciones")
public class PublicacionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel usuario; // Quien publica

    private String googleBookId;
    private String tituloLibro;
    private String imagenLibro;
    
    @Column(columnDefinition = "TEXT")
    private String textoPublicacion;

    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL)
    private List<ComentarioModel> comentarios; // Lista de respuestas

    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL)
    private List<ReaccionModel> reacciones;

    // Getters y Setters para PublicacionModel
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UsuarioModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioModel usuario) {
        this.usuario = usuario;
    }

    public String getGoogleBookId() {
        return googleBookId;
    }

    public void setGoogleBookId(String googleBookId) {
        this.googleBookId = googleBookId;
    }

    public String getTituloLibro() {
        return tituloLibro;
    }

    public void setTituloLibro(String tituloLibro) {
        this.tituloLibro = tituloLibro;
    }

    public String getImagenLibro() {
        return imagenLibro;
    }

    public void setImagenLibro(String imagenLibro) {
        this.imagenLibro = imagenLibro;
    }

    public String getTextoPublicacion() {
        return textoPublicacion;
    }

    public void setTextoPublicacion(String textoPublicacion) {
        this.textoPublicacion = textoPublicacion;
    }

    public List<ComentarioModel> getComentarios() {
        return comentarios;
    }

    public void setComentarios(List<ComentarioModel> comentarios) {
        this.comentarios = comentarios;
    }

    public List<ReaccionModel> getReacciones(){
        return reacciones; 
    }

    public void setReacciones(List<ReaccionModel> reacciones) { 
        this.reacciones = reacciones; 
    }
}
