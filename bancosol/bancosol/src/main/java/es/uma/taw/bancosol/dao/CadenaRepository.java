package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Cadena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CadenaRepository extends JpaRepository<Cadena, Integer> {
}