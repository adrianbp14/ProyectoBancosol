package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Capitan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CapitanRepository extends JpaRepository<Capitan, Integer> {

    // Busca al capitán asociado al ID del usuario logueado
    @Query("SELECT c FROM Capitan c WHERE c.usuario.id_usuario = :idUsuario")
    Optional<Capitan> findByUsuarioId(@Param("idUsuario") Integer idUsuario);
}