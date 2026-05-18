package es.uma.taw.bancosol.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TiendaMapaDTO {
    private Integer id;

    @JsonProperty("resena_nombre") 
    private String nombre;

    private String domicilio;

    @JsonProperty("codigo_postal")
    private String codigoPostal;

    private String localidad;
    private Double latitud;
    private Double longitud;
}