package es.uma.taw.bancosol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Entity
@Table(name = "campana")
@Getter
@Setter
public class Campana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campana")
    @JsonProperty("id_campana")
    private Integer idCampana;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "anio")
    private Integer anio;

    @Column(name = "fecha_inicio")
    @JsonProperty("fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    @JsonProperty("fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "tipo_campana")
    @JsonProperty("tipo_campana")
    private String tipoCampana;
}