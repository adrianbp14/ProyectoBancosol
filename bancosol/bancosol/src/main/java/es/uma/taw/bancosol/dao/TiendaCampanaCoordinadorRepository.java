package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.TiendaCampanaCoordinador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaCampanaCoordinadorRepository extends JpaRepository<TiendaCampanaCoordinador, Integer> {
}