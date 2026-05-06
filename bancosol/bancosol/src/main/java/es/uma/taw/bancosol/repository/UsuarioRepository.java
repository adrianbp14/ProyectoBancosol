package es.uma.taw.bancosol.repository;

import es.uma.taw.bancosol.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Spring Data JPA crea la consulta automáticamente
    Optional<Usuario> findByUsername(String username);
}