package es.uma.taw.bancosol.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor // 🌟 Esto genera el constructor vacío que necesita tu AdminController
public class TiendasCapitanDTO {

    @JsonProperty("id_tienda")
    private Integer idTienda;

    @JsonProperty("resena_nombre")
    private String resenaNombre;

    private String domicilio;

    @JsonProperty("codigo_postal")
    private String codigoPostal;

    private List<VoluntarioResumenDTO> voluntarios;

    @JsonProperty("nombre_capitan") // 🌟 Mapeo limpio para el Frontend
    private String nombreCapitan;

    // Constructor completo (por si lo usas en el CapitanController)
    public TiendasCapitanDTO(Integer idTienda, String resenaNombre, String domicilio, String codigoPostal, List<VoluntarioResumenDTO> voluntarios) {
        this.idTienda = idTienda;
        this.resenaNombre = resenaNombre;
        this.domicilio = domicilio;
        this.codigoPostal = codigoPostal;
        this.voluntarios = voluntarios;
    }
}