package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.AsignacionVoluntarioDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionVoluntarioDetalleRepository extends JpaRepository<AsignacionVoluntarioDetalle, Integer> {
    // Comprueba si un voluntario ya está asignado a esa cabecera para evitar duplicados
    boolean existsByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(Integer idAsignacion, Integer idVoluntario);
    List<AsignacionVoluntarioDetalle> findByAsignacion_IdAsignacion(Integer idAsignacion);
    @org.springframework.transaction.annotation.Transactional
    void deleteByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(Integer idAsignacion, Integer idVoluntario);
}