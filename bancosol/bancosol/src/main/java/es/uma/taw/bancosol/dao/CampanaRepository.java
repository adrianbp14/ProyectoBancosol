package es.uma.taw.bancosol.dao;

import es.uma.taw.bancosol.entity.Campana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampanaRepository extends JpaRepository<Campana, Integer> {
    // Esto permitirá buscar campañas por ID en TiendaService
}