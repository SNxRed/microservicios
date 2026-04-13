package com.biblioteca.biblioteca_comenta.controllers;

import java.util.ArrayList;

//import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.biblioteca_comenta.models.UsuarioModel;
import com.biblioteca.biblioteca_comenta.services.UsuarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/usuario")
//@CrossOrigin(origins = "http://localhost:5173") //en donde se lavanta el front recuerda 
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @GetMapping()
    public ArrayList<UsuarioModel> obtenerUsuarios(){
        return usuarioService.obtenerUsuarios();
    }

    @PostMapping()
    public UsuarioModel guardarUsuario(@RequestBody UsuarioModel usuario){
        
        return this.usuarioService.guardarUsuario(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody UsuarioModel credenciales) {
        try{
            UsuarioModel usuario = usuarioService.login(credenciales.getMail(), credenciales.getPassword());
            return ResponseEntity.ok(usuario);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    // Agrega este endpoint debajo de los que ya tienes
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioModel usuario = usuarioService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioModel usuario) {
        try {
            UsuarioModel usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            // Esto atrapa el error "El correo ingresado ya está en uso..." y lo manda a React
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }
    
    
}
