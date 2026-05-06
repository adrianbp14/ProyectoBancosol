package es.uma.taw.bancosol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "colaboradores")
@Getter // Lombok: Genera todos los getters automáticamente
@Setter // Lombok: Genera todos los setters automáticamente
@NoArgsConstructor // Lombok: Genera el constructor vacío que exige JPA
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idColaborador;

    @Column(length = 150, nullable = false)
    private String nombre;

    @Column(length = 10)
    private String codigoBancosol; // Ej: A0362

    private Boolean vinculadoBancosol;

    @Column(length = 200)
    private String domicilio;

    @Column(length = 100)
    private String localidad;

    @Column(length = 5)
    private String codigoPostal;

    private Integer numVoluntariosEstimado;

    @Column(length = 20)
    private String estadoValidacion; // "Pendiente", "Aprobado", "Rechazado"

    @Column(length = 50)
    private String tipoColaborador;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private Long idCoordinador;

    // Relación 1 a N: Un colaborador tiene muchos contactos.
    @OneToMany(mappedBy = "colaborador", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactoColaborador> contactos = new ArrayList<>();

    // Método de ayuda para mantener la sincronización bidireccional (Mantenemos esto)
    public void addContacto(ContactoColaborador contacto) {
        contactos.add(contacto);
        contacto.setColaborador(this);
    }

    public void removeContacto(ContactoColaborador contacto) {
        contactos.remove(contacto);
        contacto.setColaborador(null);
    }
}