package es.uma.taw.bancosol.dao;
import es.uma.taw.bancosol.entity.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

    // Spring Boot es tan listo que solo con escribir este nombre de método,
    // sabe que tiene que hacer un "SELECT * WHERE estado_validacion = ?"
    // Lo usaremos más adelante para que el Administrador vea los pendientes.
    List<Colaborador> findByEstadoValidacion(String estado);
}