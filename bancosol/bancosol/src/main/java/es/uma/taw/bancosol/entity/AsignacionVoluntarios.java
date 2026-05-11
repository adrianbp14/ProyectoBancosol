package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "asignacion_voluntarios")
public class AsignacionVoluntarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    @JsonProperty("id_asignacion")
    private Integer idAsignacion;

    @ManyToOne
    @JoinColumn(name = "id_tienda")
    @JsonProperty("tienda")
    private Tienda tienda;

    @Column(name = "id_campana")
    @JsonProperty("id_campana")
    private Integer idCampana;

    @Column(name = "id_colaborador")
    @JsonProperty("id_colaborador")
    private Integer idColaborador;

    @Column(name = "id_capitan")
    @JsonProperty("id_capitan")
    private Integer idCapitan;

    @Column(name = "dia_semana")
    @JsonProperty("dia_semana")
    private String diaSemana;

    @Column(name = "turno_franja")
    @JsonProperty("turno_franja")
    private String turnoFranja;

    @Column(name = "hora_inicio")
    @JsonProperty("hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    @JsonProperty("hora_fin")
    private LocalTime horaFin;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    @JsonProperty("observaciones")
    private String observaciones;

    @Column(name = "id_coordinador_asignador")
    @JsonProperty("id_coordinador_asignador")
    private Integer idCoordinadorAsignador;
}