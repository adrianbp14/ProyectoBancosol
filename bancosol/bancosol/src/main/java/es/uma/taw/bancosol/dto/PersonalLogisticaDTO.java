package es.uma.taw.bancosol.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonalLogisticaDTO {

    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;

    @JsonProperty("entidad_pertenencia")
    private String entidadPertenencia;

    @JsonProperty("id_localidad")
    private Integer idLocalidad;

    @JsonProperty("id_distrito")
    private Integer idDistrito;
}