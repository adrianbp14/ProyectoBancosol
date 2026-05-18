package es.uma.taw.bancosol.dao;
import es.uma.taw.bancosol.entity.EntidadColaboradora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {
    
    List<EntidadColaboradora> findByEstadoValidacion(String estado);
}