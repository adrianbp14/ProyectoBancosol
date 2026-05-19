package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "coordinador")
public class Coordinador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_coordinador")
    @JsonProperty("id_coordinador")
    private Integer idCoordinador;

    @Column(name = "entidad_pertenencia", length = 100)
    @JsonProperty("entidad_pertenencia")
    private String entidadPertenencia;

    @Column(name = "telefono", length = 255)
    @JsonProperty("telefono")
    private String telefono;

    @Column(name = "email", length = 255)
    @JsonProperty("email")
    private String email;

    @Column(name = "nombre", length = 255)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "apellidos", length = 255)
    @JsonProperty("apellidos")
    private String apellidos;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonProperty("usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_localidad")
    @JsonProperty("localidad")
    private Localidad localidad;
    
    @ManyToOne
    @JoinColumn(name = "id_distrito")
    @JsonProperty("distrito")
    private Distrito distrito;

}