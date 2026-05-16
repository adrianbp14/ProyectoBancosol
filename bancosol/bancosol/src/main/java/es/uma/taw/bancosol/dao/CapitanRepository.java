package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Capitan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CapitanRepository extends JpaRepository<Capitan, Integer> {
}