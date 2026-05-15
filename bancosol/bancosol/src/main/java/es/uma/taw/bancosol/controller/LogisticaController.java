package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.entity.Voluntario;
import es.uma.taw.bancosol.entity.AsignacionVoluntarios;
import es.uma.taw.bancosol.entity.AsignacionVoluntarioDetalle;
import es.uma.taw.bancosol.TiendaService;
import es.uma.taw.bancosol.dao.TiendaRepository;
// Asegúrate de que este paquete coincida con donde creaste los repositorios nuevos
import es.uma.taw.bancosol.dao.AsignacionVoluntariosRepository;
import es.uma.taw.bancosol.dao.AsignacionVoluntarioDetalleRepository;
import es.uma.taw.bancosol.dao.VoluntarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LogisticaController {

    // ==========================================
    // DEPENDENCIAS EXISTENTES
    // ==========================================
    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private TiendaService tiendaService;

    // ==========================================
    // NUEVAS DEPENDENCIAS PARA VOLUNTARIOS
    // ==========================================
    @Autowired
    private AsignacionVoluntariosRepository asignacionRepo;

    @Autowired
    private AsignacionVoluntarioDetalleRepository detalleRepo;

    @Autowired
    private VoluntarioRepository voluntarioRepo;


    // ==========================================
    // ENDPOINTS EXISTENTES
    // ==========================================
    @GetMapping("/tiendas")
    public List<Tienda> obtenerTiendas(@RequestParam(name = "campanaId", required = false) Integer campanaId) {
        if (campanaId != null) {
            // Buscamos solo las tiendas de esa campaña específica
            return this.tiendaRepository.findByCampanaId(campanaId);
        } else {
            // Si no se selecciona campaña, devolvemos el listado completo
            return this.tiendaRepository.findAll();
        }
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

    // ==========================================
    // NUEVO ENDPOINT: ASIGNAR VOLUNTARIO
    // ==========================================
    @PostMapping("/asignar-voluntario")
    public ResponseEntity<?> asignarVoluntario(@RequestBody Map<String, Object> datos) {
        try {
            // 1. Extraemos los IDs del JSON (siguiendo tu mismo estilo)
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Integer idVoluntario = Integer.parseInt(datos.get("idVoluntario").toString());
            Integer idCampana = Integer.parseInt(datos.get("idCampana").toString());

            // 2. Buscar la tienda y el voluntario en la base de datos
            Tienda tienda = tiendaRepository.findById(idTienda)
                    .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

            Voluntario voluntario = voluntarioRepo.findById(idVoluntario)
                    .orElseThrow(() -> new RuntimeException("Voluntario no encontrado"));

            // 3. Buscar si ya existe una "Cabecera de Asignación" para esta Tienda y Campaña
            AsignacionVoluntarios asignacion = asignacionRepo
                    .findByTienda_IdTiendaAndIdCampana(idTienda, idCampana)
                    .orElseGet(() -> {
                        // Si no existe, creamos una nueva cabecera
                        AsignacionVoluntarios nueva = new AsignacionVoluntarios();
                        nueva.setTienda(tienda);
                        nueva.setIdCampana(idCampana);
                        return asignacionRepo.save(nueva);
                    });

            // 4. Comprobar que el voluntario no esté ya en esa asignación
            boolean yaAsignado = detalleRepo.existsByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(
                    asignacion.getIdAsignacion(), voluntario.getIdVoluntario());

            if (yaAsignado) {
                // El frontend busca la palabra "duplicate" para mostrar el aviso amarillo
                return ResponseEntity.status(HttpStatus.CONFLICT).body("duplicate: El voluntario ya está asignado");
            }

            // 5. Crear el detalle (enlazar voluntario con la asignación)
            AsignacionVoluntarioDetalle detalle = new AsignacionVoluntarioDetalle();
            detalle.setAsignacion(asignacion);
            detalle.setVoluntario(voluntario);
            detalle.setHaAsistido(false);

            detalleRepo.save(detalle);

            return ResponseEntity.ok().body("Voluntario asignado correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}