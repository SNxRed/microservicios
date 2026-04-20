package com.biblioteca.biblioteca_comenta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactivamos CSRF para las peticiones de React
            .cors(Customizer.withDefaults()) // Mantiene la configuración CORS
            .authorizeHttpRequests(auth -> auth
                // CAMBIO AQUÍ: Pasamos el String directamente sin el AntPathRequestMatcher
                .requestMatchers("/h2-console/**").permitAll() 
                .anyRequest().permitAll() // Resto de endpoints abiertos por ahora
            )
            // Permite que H2 renderice sus iframes
            .headers(headers -> headers.frameOptions(frame -> frame.disable())); 
        
        return http.build();
    }
}