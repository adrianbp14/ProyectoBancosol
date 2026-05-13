package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_rol;

    @Column(name = "nombre_rol", nullable = false, length = 50)
    private String nombre_rol;

    // Opcional: Relación inversa para ver qué usuarios tienen este rol
    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<Usuario> usuarios;
}