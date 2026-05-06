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
    @Column(name = "id_tienda")
    @JsonProperty("id_tienda")
    private Integer idTienda;

    @Column(name = "id_cadena")
    @JsonProperty("id_cadena")
    private Integer idCadena;

    @Column(name = "id_linea")
    @JsonProperty("id_linea")
    private Integer idLinea;

    @Column(name = "resena_nombre", nullable = false)
    @JsonProperty("resena_nombre") // Esto hará que en JS uses tienda.resena_nombre
    private String resenaNombre;

    @Column(name = "domicilio")
    @JsonProperty("domicilio")
    private String domicilio;

    @Column(name = "codigo_postal")
    @JsonProperty("codigo_postal") // Esto solucionará el problema del CP: N/A
    private String codigoPostal;

    @Column(name = "clasificacion")
    @JsonProperty("clasificacion")
    private String clasificacion;

    @Column(name = "num_lineas_caja")
    @JsonProperty("num_lineas_caja")
    private Integer numLineasCaja;

    @Column(name = "observaciones_acceso")
    @JsonProperty("observaciones_acceso")
    private String observacionesAcceso;

    @Column(name = "id_distrito")
    @JsonProperty("id_distrito")
    private Integer idDistrito;

    @Column(name = "latitud")
    @JsonProperty("latitud")
    private Double latitud;

    @Column(name = "longitud")
    @JsonProperty("longitud")
    private Double longitud;

    // Relación con Localidad
    @ManyToOne
    @JoinColumn(name = "id_localidad")
    @JsonProperty("localidad")
    private Localidad localidad;
}