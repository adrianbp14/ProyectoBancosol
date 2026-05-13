package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "localidad")
public class Localidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_localidad")
    @JsonProperty("id_localidad")
    private Integer idLocalidad;

    @Column(name = "nombre", nullable = false)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "codigo_postal", nullable = false)
    @JsonProperty("codigo_postal")
    private String codigoPostal;

    // Relación con Provincia
    @ManyToOne
    @JoinColumn(name = "id_provincia", nullable = false)
    @JsonProperty("provincia")
    private Provincia provincia;

    // Relación con Zona Geográfica (id_zona en tu SQL)
    @ManyToOne
    @JoinColumn(name = "id_zona")
    @JsonProperty("zona")
    private ZonaGeografica zona;
}