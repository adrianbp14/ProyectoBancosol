package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.TiendaService; // Importa tu nuevo servicio
import es.uma.taw.bancosol.dao.TiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LogisticaController {

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private TiendaService tiendaService; // <--- Inyectamos el servicio para la asignación

    @GetMapping("/tiendas")
    public List<Tienda> obtenerTodasLasTiendas() {
        return tiendaRepository.findAll();
    }

    @PostMapping("/asignar")
    public ResponseEntity<?> asignar(@RequestBody Map<String, Object> datos) {
        try {
            // 1. Extraemos los tres IDs necesarios del JSON que viene de la web
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Long idCoordinador = Long.parseLong(datos.get("idCoordinador").toString());
            Integer idCampana = Integer.parseInt(datos.get("idCampana").toString());

            // 2. Llamamos al servicio con los TRES parámetros
            tiendaService.asignarCoordinador(idTienda, idCoordinador, idCampana);

            return ResponseEntity.ok().body(Map.of("message", "Asignación realizada con éxito"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al asignar: " + e.getMessage());
        }
    }
}