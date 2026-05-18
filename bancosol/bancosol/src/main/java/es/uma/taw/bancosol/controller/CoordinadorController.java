package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.*;
import es.uma.taw.bancosol.dto.DashboardCoordinadorDTO;
import es.uma.taw.bancosol.dto.PersonalLogisticaDTO;
import es.uma.taw.bancosol.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/coordinadores")
public class CoordinadorController {

    @Autowired
    private CoordinadorRepository coordinadorRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private LocalidadRepository localidadRepository;
    @Autowired
    private TiendaRepository tiendaRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearCoordinador(@RequestBody PersonalLogisticaDTO dto) {
        try {
            Usuario nuevoUsuario = new Usuario();

            String nombreLimpio = dto.getNombre().toLowerCase().trim().replace(" ", "");
            nuevoUsuario.setUsername(nombreLimpio + "_" + System.currentTimeMillis() + "_coord");

            nuevoUsuario.setPassword("bancosol123");
            nuevoUsuario.setNombre_completo(dto.getNombre() + " " + (dto.getApellidos() != null ? dto.getApellidos() : ""));
            nuevoUsuario.setEmail(dto.getEmail());

            Rol rolCoordinador = rolRepository.findById(2).orElseThrow(() -> new RuntimeException("El Rol con ID 2 no existe en la base de datos"));
            nuevoUsuario.setRol(rolCoordinador);

            Usuario usuarioGuardado = usuarioRepository.saveAndFlush(nuevoUsuario);

            Coordinador nuevoCoordinador = new Coordinador();
            nuevoCoordinador.setUsuario(usuarioGuardado);
            nuevoCoordinador.setNombre(dto.getNombre());
            nuevoCoordinador.setApellidos(dto.getApellidos());
            nuevoCoordinador.setEmail(dto.getEmail());
            nuevoCoordinador.setTelefono(dto.getTelefono());
            nuevoCoordinador.setEntidadPertenencia(dto.getEntidadPertenencia());

            if (dto.getIdLocalidad() != null) {
                nuevoCoordinador.setLocalidad(localidadRepository.findById(dto.getIdLocalidad()).orElse(null));
            }

            coordinadorRepository.saveAndFlush(nuevoCoordinador);

            return ResponseEntity.ok().body("{\"mensaje\": \"Coordinador creado con éxito\"}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error interno al crear coordinador: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Coordinador>> listarCoordinadores() {
        try {
            // Buscamos todos los coordinadores en la base de datos
            List<Coordinador> lista = coordinadorRepository.findAll();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // MÉTODO PARA EDITAR
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCoordinador(@PathVariable Integer id, @RequestBody PersonalLogisticaDTO dto) {
        try {
            // Buscamos el coordinador que vamos a editar
            Coordinador coord = coordinadorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

            // Actualizamos sus datos
            coord.setNombre(dto.getNombre());
            coord.setApellidos(dto.getApellidos());
            coord.setEmail(dto.getEmail());
            coord.setTelefono(dto.getTelefono());
            coord.setEntidadPertenencia(dto.getEntidadPertenencia());

            // Actualizar Localidad si la envían
            if (dto.getIdLocalidad() != null) {
                coord.setLocalidad(localidadRepository.findById(dto.getIdLocalidad()).orElse(null));
            }

            coordinadorRepository.save(coord);
            return ResponseEntity.ok().body("{\"mensaje\": \"Coordinador actualizado con éxito\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar: " + e.getMessage());
        }
    }

    // ==========================================
    // MÉTODO PARA ELIMINAR
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarCoordinador(@PathVariable Integer id) {
        try {
            // Buscamos el coordinador
            Coordinador coord = coordinadorRepository.findById(id).orElse(null);
            if (coord != null) {
                // Lo borramos de la base de datos
                coordinadorRepository.delete(coord);
                return ResponseEntity.ok().body("{\"mensaje\": \"Coordinador borrado con éxito\"}");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Si salta esta excepción suele ser porque tiene Tiendas asignadas y PostgreSQL bloquea el borrado por seguridad (Foreign Key)
            return ResponseEntity.badRequest().body("Error al borrar: " + e.getMessage());
        }
    }


    // ==========================================
    // CUADRO DE MANDO DEL COORDINADOR
    // ==========================================
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<DashboardCoordinadorDTO> obtenerDashboardCoordinador(@PathVariable Integer id) {
        try {
            // 1. Verificar que el coordinador existe
            Coordinador coord = coordinadorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

            DashboardCoordinadorDTO dashboard = new DashboardCoordinadorDTO();

            // -------------------------------------------------------------
            // TODO: Aquí tendrás que llamar a los Repositorios de verdad.
            // Por ejemplo: tiendaRepository.countByCoordinador(coord);
            // -------------------------------------------------------------

            // DATOS FALSOS PARA PROBAR LA CONEXIÓN FRONT-BACK:
            dashboard.setTotalTiendasAsignadas(4);
            dashboard.setKilosTotalesZona(1250.50);
            dashboard.setTurnosIncompletos(2); // ¡Atención a esto!

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/tiendas")
    public ResponseEntity<List<Tienda>> obtenerTiendasAsignadas(
            @PathVariable Integer id,
            @RequestParam(name = "rol", required = false) String rol,
            @RequestParam(name = "idCampana", defaultValue = "1") Integer idCampana) {
        try {
            if (rol != null && rol.toUpperCase().contains("ADMIN")) {
                List<Tienda> tiendasCampana = tiendaRepository.findByCampanaId(idCampana);
                return ResponseEntity.ok(tiendasCampana);
            }

            // Ahora filtramos por Coordinador Y por Campaña
            List<Tienda> tiendas = tiendaRepository.findTiendasByCoordinadorAndCampana(id, idCampana);
            return ResponseEntity.ok(tiendas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


}