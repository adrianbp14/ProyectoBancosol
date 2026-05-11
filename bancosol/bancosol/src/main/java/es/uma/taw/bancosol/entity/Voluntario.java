package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "voluntario")
public class Voluntario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_voluntario")
    @JsonProperty("id_voluntario")
    private Integer idVoluntario;

    @Column(name = "nombre", nullable = false)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "apellidos")
    @JsonProperty("apellidos")
    private String apellidos;

    @Column(name = "dni", unique = true)
    @JsonProperty("dni")
    private String dni;

    @Column(name = "telefono")
    @JsonProperty("telefono")
    private String telefono;

    @Column(name = "email")
    @JsonProperty("email")
    private String email;

    @Column(name = "id_coordinador_responsable")
    @JsonProperty("id_coordinador_responsable")
    private Integer idCoordinadorResponsable;
}