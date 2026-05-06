package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "provincia")
public class Provincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_provincia;

    @Column(nullable = false, length = 50)
    private String nombre;

    @OneToMany(mappedBy = "provincia")
    @JsonIgnore
    private List<Localidad> localidades;
}