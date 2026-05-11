package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.AsignacionVoluntarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AsignacionVoluntariosRepository extends JpaRepository<AsignacionVoluntarios, Integer> {
    // Busca si ya existe una cabecera de asignación para esa tienda y campaña
    Optional<AsignacionVoluntarios> findByTienda_IdTiendaAndIdCampana(Integer idTienda, Integer idCampana);
}