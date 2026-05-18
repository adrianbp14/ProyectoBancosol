package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Integer> {

    @Query(value = "SELECT t.* FROM tienda t " +
            "INNER JOIN cadena_campana cc ON t.id_cadena = cc.id_cadena " +
            "WHERE cc.id_campana = :idCampana",
            nativeQuery = true)
    List<Tienda> findByCampanaId(@Param("idCampana") Integer idCampana);
    
    @Query(value = "SELECT t.* FROM tienda t " +
            "JOIN tienda_campana_coordinador tcc ON t.id_tienda = tcc.id_tienda " +
            "WHERE tcc.id_coordinador = :idCoordinador",
            nativeQuery = true)
    List<Tienda> findTiendasByCoordinadorId(@Param("idCoordinador") Integer idCoordinador);
}