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
            // 1. Extraemos Tienda y Campaña de forma segura
            if (datos.get("idTienda") == null || datos.get("idCampana") == null) {
                throw new RuntimeException("Faltan datos de la tienda o la campaña en la petición.");
            }
            Integer idTienda = Integer.parseInt(datos.get("idTienda").toString());
            Integer idCampana = Integer.parseInt(datos.get("idCampana").toString());

            // 2. Buscamos el ID del coordinador usando los posibles nombres que envíe tu JS
            Object coordObj = datos.get("idCoordinador");
            if (coordObj == null) coordObj = datos.get("idCoord");
            if (coordObj == null) coordObj = datos.get("idUsuario");

            if (coordObj == null) {
                throw new RuntimeException("Falta el ID del coordinador en la petición.");
            }

            // Lo pasamos a Integer (o Long, según lo que espere tu TiendaService)
            Integer idCoordinador = Integer.parseInt(coordObj.toString());

            // 3. Llamamos al servicio
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

    // ==========================================
    // NUEVO ENDPOINT: LEER TURNOS DE UNA TIENDA
    // ==========================================
    @GetMapping("/tiendas/{idTienda}/turnos")
    public ResponseEntity<?> obtenerTurnosDeTienda(@PathVariable Integer idTienda) {
        try {
            // 1. Buscamos los turnos (franjas) de esta tienda
            List<AsignacionVoluntarios> asignaciones = asignacionRepo.findByTienda_IdTienda(idTienda);

            // 2. Preparamos una lista a medida para el frontend
            List<Map<String, Object>> respuesta = new java.util.ArrayList<>();

            for (AsignacionVoluntarios asig : asignaciones) {
                // Buscamos quiénes están apuntados a este turno concreto
                List<AsignacionVoluntarioDetalle> detalles = detalleRepo.findByAsignacion_IdAsignacion(asig.getIdAsignacion());

                Map<String, Object> turnoData = new java.util.HashMap<>();
                turnoData.put("idTurno", asig.getIdAsignacion());

                // Juntamos el día y la franja (ej. "Viernes - Mañana")
                String dia = asig.getDiaSemana() != null ? asig.getDiaSemana() : "Día Sin Asignar";
                String franja = asig.getTurnoFranja() != null ? asig.getTurnoFranja() : "";
                turnoData.put("franjaHoraria", dia + " " + franja);

                // Sacamos los datos de los voluntarios asignados
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

    // ==========================================
    // ELIMINAR VOLUNTARIO DE UN TURNO
    // ==========================================
    @DeleteMapping("/turnos/{idAsignacion}/voluntarios/{idVoluntario}")
    public ResponseEntity<?> eliminarVoluntarioDeTurno(@PathVariable Integer idAsignacion, @PathVariable Integer idVoluntario) {
        try {
            detalleRepo.deleteByAsignacion_IdAsignacionAndVoluntario_IdVoluntario(idAsignacion, idVoluntario);
            return ResponseEntity.ok().body("Voluntario eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar: " + e.getMessage());
        }
    }

}