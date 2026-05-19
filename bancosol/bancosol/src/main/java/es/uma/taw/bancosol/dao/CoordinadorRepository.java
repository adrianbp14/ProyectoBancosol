package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Coordinador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinadorRepository extends JpaRepository<Coordinador, Integer> {
}