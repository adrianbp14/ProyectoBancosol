package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.AsignacionVoluntarioDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsignacionVoluntarioDetalleRepository extends JpaRepository<AsignacionVoluntarioDetalle, Integer> {
    // Comprueba si un voluntario ya está asignado a esa cabecera para evitar duplicados
    boolean existsByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(Integer idAsignacion, Integer idVoluntario);
}