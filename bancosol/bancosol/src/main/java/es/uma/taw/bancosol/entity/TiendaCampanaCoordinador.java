package es.uma.taw.bancosol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "tienda_campana_coordinador")
@Getter
@Setter
public class TiendaCampanaCoordinador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_tienda")
    private Tienda tienda;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_campana")
    private Campana campana;

    @ManyToOne
    @JoinColumn(name = "id_coordinador")
    private Coordinador coordinador;
}
