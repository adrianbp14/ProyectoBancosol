package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.TiendaRepository;
import es.uma.taw.bancosol.dto.TiendasCapitanDTO;
import es.uma.taw.bancosol.dto.VoluntarioResumenDTO;
import es.uma.taw.bancosol.entity.Tienda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private TiendaRepository tiendaRepository;

    /**
     * Devuelve el catálogo global de todas las tiendas con su capitán y su lista de voluntarios asignados
     */
    @GetMapping("/todas-tiendas-voluntarios")
    public ResponseEntity<List<TiendasCapitanDTO>> obtenerTodasLasTiendasYVoluntarios() {
        try {
            // 1. Recuperamos absolutamente todas las tiendas del sistema
            List<Tienda> tiendas = tiendaRepository.findAll();

            // 2. Transformamos la lista de entidades al DTO que espera el Frontend
            List<TiendasCapitanDTO> resultado = tiendas.stream().map(tienda -> {
                TiendasCapitanDTO dto = new TiendasCapitanDTO();
                dto.setIdTienda(tienda.getIdTienda());
                dto.setResenaNombre(tienda.getResenaNombre());
                dto.setDomicilio(tienda.getDomicilio());
                dto.setCodigoPostal(tienda.getCodigoPostal());

                // 👑 CAPITÁN: Verificamos si la tienda tiene un usuario/capitán vinculado
                if (tienda.getUsuario() != null) {
                    // Sacamos el identificador o nombre que pintaremos en el badge
                    dto.setNombreCapitan(tienda.getUsuario().getUsername());
                } else {
                    dto.setNombreCapitan("Sin Capitán");
                }

                // 🤝 VOLUNTARIOS: Usamos la query nativa corregida que cruza con asignacion_voluntario_detalle
                List<Object[]> voluntariosObj = tiendaRepository.findVoluntariosByTiendaId(tienda.getIdTienda());

                List<VoluntarioResumenDTO> voluntariosDTO = voluntariosObj.stream().map(obj -> {
                    VoluntarioResumenDTO v = new VoluntarioResumenDTO();
                    v.setNombre((String) obj[0]);
                    v.setApellidos((String) obj[1]);
                    v.setTelefono((String) obj[2]);
                    v.setEmail((String) obj[3]);
                    return v;
                }).collect(Collectors.toList());

                dto.setVoluntarios(voluntariosDTO);
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            System.err.println("Error en AdminController al procesar el listado global: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}