package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "asignacion_voluntario_detalle")
public class AsignacionVoluntarioDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    @JsonProperty("id_detalle")
    private Integer idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_asignacion")
    @JsonProperty("asignacion")
    private AsignacionVoluntarios asignacion;

    @ManyToOne
    @JoinColumn(name = "id_voluntario")
    @JsonProperty("voluntario")
    private Voluntario voluntario;

    @Column(name = "ha_asistido")
    @JsonProperty("ha_asistido")
    private Boolean haAsistido = false;
}