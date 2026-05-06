package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tienda")
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_tienda;

    @Column(name = "resena_nombre", nullable = false)
    @JsonProperty("resenaNombre")
    private String resenaNombre;

    @Column(name = "domicilio")
    private String domicilio;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "clasificacion")
    private String clasificacion;

    // Relación con Localidad (Muchos a Uno)
    @ManyToOne
    @JoinColumn(name = "id_localidad")
    private Localidad localidad;

    // CAMPOS NECESARIOS PARA EL MAPA
    // Si no están en la tabla física, recuerda añadirlos con un ALTER TABLE
    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;

    // El resto de campos de tu imagen (num_lineas_caja, observaciones, etc.)
}