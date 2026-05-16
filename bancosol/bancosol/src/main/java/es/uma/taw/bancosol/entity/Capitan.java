package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "capitan")
public class Capitan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_capitan")
    @JsonProperty("id_capitan")
    private Integer idCapitan;

    @Column(name = "nombre", length = 255)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "apellidos", length = 255)
    @JsonProperty("apellidos")
    private String apellidos;

    @Column(name = "telefono", length = 255)
    @JsonProperty("telefono")
    private String telefono;

    @Column(name = "email", length = 255)
    @JsonProperty("email")
    private String email;


    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonProperty("usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "name = id_localidad")
    @JsonProperty("localidad")
    private Localidad localidad;
}