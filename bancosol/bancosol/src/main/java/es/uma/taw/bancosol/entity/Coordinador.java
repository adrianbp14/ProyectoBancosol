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

    // length = 100 según el SQL
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

    // --- Relaciones (Claves Foráneas confirmadas por el SQL) ---

    // constraint colaborador_id_usuario_fkey foreign KEY (id_usuario) references usuario (id_usuario)
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonProperty("usuario")
    private Usuario usuario;

    // constraint coordinador_id_localidad_fkey foreign KEY (id_localidad) references localidad (id_localidad)
    @ManyToOne
    @JoinColumn(name = "id_localidad")
    @JsonProperty("localidad")
    private Localidad localidad;

    // constraint fk_coordinador_distrito foreign KEY (id_distrito) references distrito (id_distrito)
    @ManyToOne
    @JoinColumn(name = "id_distrito")
    @JsonProperty("distrito")
    private Distrito distrito;

}