package es.uma.taw.bancosol.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacto_colaborador")
@Getter // Lombok: Genera todos los getters
@Setter // Lombok: Genera todos los setters
@NoArgsConstructor // Lombok: Genera el constructor vacío (public ContactoColaborador() {})
public class ContactoColaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContacto;

    @Column(length = 100, nullable = false)
    private String nombreContacto;

    @Column(length = 15)
    private String telefono;

    @Column(length = 100)
    private String email;

    private Boolean esPrincipal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id")
    @JsonIgnore
    private EntidadColaboradora colaborador;

}