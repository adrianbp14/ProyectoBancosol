package es.uma.taw.bancosol.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "entidad_colaboradora")
public class EntidadColaboradora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_colaborador")
    @JsonProperty("id_colaborador")
    private Integer idColaborador;

    @Column(name = "codigo_bancosol", length = 10, unique = true)
    @JsonProperty("codigo_bancosol")
    private String codigoBancosol;

    @Column(name = "nombre", nullable = false, length = 255)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "vinculado_bancosol")
    @JsonProperty("vinculado_bancosol")
    private Boolean vinculadoBancosol;

    @Column(name = "domicilio", length = 255)
    @JsonProperty("domicilio")
    private String domicilio;

    @Column(name = "codigo_postal", length = 10)
    @JsonProperty("codigo_postal")
    private String codigoPostal;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    @JsonProperty("observaciones")
    private String observaciones;

    @Column(name = "estado_validacion", length = 20)
    @JsonProperty("estado_validacion")
    private String estadoValidacion;

    @ManyToOne
    @JoinColumn(name = "id_localidad")
    @JsonProperty("localidad")
    private Localidad localidad;

    @ManyToOne
    @JoinColumn(name = "id_coordinador")
    @JsonProperty("coordinador")
    private Coordinador coordinador;

    @ManyToOne
    @JoinColumn(name = "ultima_campana_id")
    @JsonProperty("ultima_campana")
    private Campana ultimaCampana;
    
    @OneToMany(mappedBy = "colaborador", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ContactoColaborador> contactos;
}