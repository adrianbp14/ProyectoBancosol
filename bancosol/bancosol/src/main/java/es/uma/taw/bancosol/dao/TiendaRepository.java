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
            "JOIN coordinador c ON tcc.id_coordinador = c.id_coordinador " +
            "WHERE c.id_usuario = :idUsuario AND tcc.id_campana = :idCampana",
            nativeQuery = true)
    List<Tienda> findTiendasByCoordinadorAndCampana(
            @Param("idUsuario") Integer idUsuario,
            @Param("idCampana") Integer idCampana);

    @Query("SELECT t FROM Tienda t WHERE t.usuario.id_usuario = :idUsuario")
    List<Tienda> findByUsuarioId(@Param("idUsuario") Integer idUsuario);

    @Query(value = "SELECT v.nombre, v.apellidos, v.telefono, v.email " +
            "FROM voluntario v " +
            "JOIN asignacion_voluntario_detalle avd ON v.id_voluntario = avd.id_voluntario " +
            "JOIN asignacion_voluntarios av ON avd.id_asignacion = av.id_asignacion " +
            "WHERE av.id_tienda = :idTienda", nativeQuery = true)
    List<Object[]> findVoluntariosByTiendaId(@Param("idTienda") Integer idTienda);
}
