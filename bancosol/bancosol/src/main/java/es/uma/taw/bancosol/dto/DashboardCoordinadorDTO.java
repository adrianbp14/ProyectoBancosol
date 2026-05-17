package es.uma.taw.bancosol.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardCoordinadorDTO {
    private Integer totalTiendasAsignadas;
    private Double kilosTotalesZona;
    private Integer turnosIncompletos;

    // Aquí más adelante meteremos la lista de tiendas
    // private List<TiendaDTO> misTiendas;
}