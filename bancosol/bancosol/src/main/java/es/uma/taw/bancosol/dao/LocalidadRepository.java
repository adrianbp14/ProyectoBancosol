package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Integer> { }