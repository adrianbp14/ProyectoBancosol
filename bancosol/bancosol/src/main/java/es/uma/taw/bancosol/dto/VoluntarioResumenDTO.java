package es.uma.taw.bancosol.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoluntarioResumenDTO {
    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;

    // Constructor completo para instanciarlo directamente desde el Stream del Controller
    public VoluntarioResumenDTO(String nombre, String apellidos, String telefono, String email) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.email = email;
    }
}