package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.AsignacionVoluntarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignacionVoluntariosRepository extends JpaRepository<AsignacionVoluntarios, Integer> {
    Optional<AsignacionVoluntarios> findByTienda_IdTiendaAndIdCampana(Integer idTienda, Integer idCampana);

    List<AsignacionVoluntarios> findByTienda_IdTienda(Integer idTienda);
}