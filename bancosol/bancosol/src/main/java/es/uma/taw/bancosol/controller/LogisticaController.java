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
    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private TiendaService tiendaService;

    @Autowired
    private AsignacionVoluntariosRepository asignacionRepo;

    @Autowired
    private AsignacionVoluntarioDetalleRepository detalleRepo;

    @Autowired
    private VoluntarioRepository voluntarioRepo;

    @GetMapping("/tiendas")
    public List<Tienda> obtenerTiendas(@RequestParam(name = "campanaId", required = false) Integer campanaId) {
        List<Tienda> lista;

        if (campanaId != null) {
            // Buscamos solo las tiendas de esa campaña específica
            lista = this.tiendaRepository.findByCampanaId(campanaId);
        } else {
            // Si no se selecciona campaña, devolvemos el listado completo
            lista = this.tiendaRepository.findAll();
        }

        lista.sort(java.util.Comparator.comparing(Tienda::getIdTienda));

        return lista;
    }

    @PostMapping("/asignar")
    public ResponseEntity<?> asignar(@RequestBody Map<String, Object> datos) {
        try {
            if (datos.get("idTienda") == null || datos.get("idCampana") == null) {
                throw new RuntimeException("Faltan datos de la tienda o la campaña en la petición.");
            }
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Integer idCampana = Integer.parseInt(datos.get("idCampana").toString());

            Object coordObj = datos.get("idCoordinador");
            if (coordObj == null) coordObj = datos.get("idCoord");
            if (coordObj == null) coordObj = datos.get("idUsuario");

            if (coordObj == null) {
                throw new RuntimeException("Falta el ID del coordinador en la petición.");
            }

            Integer idCoordinador = Integer.parseInt(coordObj.toString());

            tiendaService.asignarCoordinador(idTienda, idCoordinador, idCampana);

            return ResponseEntity.ok().body(Map.of("message", "Asignación realizada con éxito"));
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("duplicate")) {
                return ResponseEntity.status(409).body("duplicate: Esta tienda ya tiene coordinador.");
            }

            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al asignar: " + e.getMessage());
        }
    }

    @PostMapping("/asignar-voluntario")
    public ResponseEntity<?> asignarVoluntario(@RequestBody Map<String, Object> datos) {
        try {
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Integer idVoluntario = Integer.parseInt(datos.get("idVoluntario").toString());
            Integer idCampana = Integer.parseInt(datos.get("idCampana").toString());

            Tienda tienda = tiendaRepository.findById(idTienda)
                    .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

            Voluntario voluntario = voluntarioRepo.findById(idVoluntario)
                    .orElseThrow(() -> new RuntimeException("Voluntario no encontrado"));

            AsignacionVoluntarios asignacion = asignacionRepo
                    .findByTienda_IdTiendaAndIdCampana(idTienda, idCampana)
                    .orElseGet(() -> {
                        AsignacionVoluntarios nueva = new AsignacionVoluntarios();
                        nueva.setTienda(tienda);
                        nueva.setIdCampana(idCampana);
                        return asignacionRepo.save(nueva);
                    });

            boolean yaAsignado = detalleRepo.existsByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(
                    asignacion.getIdAsignacion(), voluntario.getIdVoluntario());

            if (yaAsignado) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("duplicate: El voluntario ya está asignado");
            }

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

    @GetMapping("/tiendas/{idTienda}/turnos")
    public ResponseEntity<?> obtenerTurnosDeTienda(@PathVariable Integer idTienda) {
        try {
            List<AsignacionVoluntarios> asignaciones = asignacionRepo.findByTienda_IdTienda(idTienda);

            List<Map<String, Object>> respuesta = new java.util.ArrayList<>();

            for (AsignacionVoluntarios asig : asignaciones) {
                List<AsignacionVoluntarioDetalle> detalles = detalleRepo.findByAsignacion_IdAsignacion(asig.getIdAsignacion());

                Map<String, Object> turnoData = new java.util.HashMap<>();
                turnoData.put("idTurno", asig.getIdAsignacion());

                String dia = asig.getDiaSemana() != null ? asig.getDiaSemana() : "Día Sin Asignar";
                String franja = asig.getTurnoFranja() != null ? asig.getTurnoFranja() : "";
                turnoData.put("franjaHoraria", dia + " " + franja);

                List<Map<String, Object>> listaVoluntarios = new java.util.ArrayList<>();
                for(AsignacionVoluntarioDetalle det : detalles) {
                    Voluntario v = det.getVoluntario();
                    Map<String, Object> volData = new java.util.HashMap<>();
                    volData.put("idVoluntario", v.getIdVoluntario()); // <-- Clave para poder borrarlo
                    volData.put("nombre", v.getNombre() + " " + (v.getApellidos() != null ? v.getApellidos() : ""));
                    listaVoluntarios.add(volData);
                }
                turnoData.put("voluntarios", listaVoluntarios);

                respuesta.add(turnoData);
            }
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al cargar turnos: " + e.getMessage());
        }
    }

    @DeleteMapping("/turnos/{idAsignacion}/voluntarios/{idVoluntario}")
    public ResponseEntity<?> eliminarVoluntarioDeTurno(@PathVariable Integer idAsignacion, @PathVariable Integer idVoluntario) {
        try {
            detalleRepo.deleteByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(idAsignacion, idVoluntario);
            return ResponseEntity.ok().body("Voluntario eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar: " + e.getMessage());
        }
    }

    // ==========================================
    // NUEVO ENDPOINT: ASIGNAR CAPITÁN
    // ==========================================
    @PostMapping("/asignar-capitan")
    public ResponseEntity<?> asignarCapitan(@RequestBody Map<String, Object> datos) {
        try {
            if (datos.get("idTienda") == null || datos.get("idCapitan") == null) {
                throw new RuntimeException("Faltan datos de la tienda o del capitán.");
            }
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Integer idCapitan = Integer.parseInt(datos.get("idCapitan").toString());

            tiendaService.asignarCapitan(idTienda, idCapitan);

            return ResponseEntity.ok().body(Map.of("message", "Capitán asignado con éxito"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al asignar capitán: " + e.getMessage());
        }
    }

}