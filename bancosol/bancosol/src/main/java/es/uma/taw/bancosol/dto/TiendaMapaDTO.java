package es.uma.taw.bancosol.dto;
import lombok.Data;

@Data
public class TiendaMapaDTO {
    private Integer id;
    private String nombre;
    private String domicilio;
    private String localidad;
    private Double latitud;
    private Double longitud;
}