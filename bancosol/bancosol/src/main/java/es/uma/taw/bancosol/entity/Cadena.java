package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cadena")
@Getter
@Setter
public class Cadena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cadena")
    private Integer idCadena;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_corto", nullable = false, length = 10, unique = true)
    @JsonProperty("codigo_corto")
    private String codigo;
}
