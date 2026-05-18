package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.*;
import es.uma.taw.bancosol.dto.PersonalLogisticaDTO;
import es.uma.taw.bancosol.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/capitanes")
public class CapitanController {

    @Autowired
    private CapitanRepository capitanRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private LocalidadRepository localidadRepository;

    @GetMapping
    public ResponseEntity<List<Capitan>> listarCapitanes() {
        try {
            return ResponseEntity.ok(capitanRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearCapitan(@RequestBody PersonalLogisticaDTO dto) {
        try {
            Usuario nuevoUsuario = new Usuario();

            String nombreLimpio = dto.getNombre().toLowerCase().trim().replace(" ", "");
            nuevoUsuario.setUsername(nombreLimpio + "_" + System.currentTimeMillis() + "_capitan");

            nuevoUsuario.setPassword("bancosol123");
            nuevoUsuario.setNombre_completo(dto.getNombre() + " " + (dto.getApellidos() != null ? dto.getApellidos() : ""));
            nuevoUsuario.setEmail(dto.getEmail());

            Rol rolCapitan = rolRepository.findById(3).orElseThrow(() -> new RuntimeException("El Rol de Capitán no existe"));
            nuevoUsuario.setRol(rolCapitan);

            Usuario usuarioGuardado = usuarioRepository.saveAndFlush(nuevoUsuario);

            Capitan nuevoCapitan = new Capitan();
            nuevoCapitan.setUsuario(usuarioGuardado);
            nuevoCapitan.setNombre(dto.getNombre());
            nuevoCapitan.setApellidos(dto.getApellidos());
            nuevoCapitan.setEmail(dto.getEmail());
            nuevoCapitan.setTelefono(dto.getTelefono());

            if (dto.getIdLocalidad() != null) {
                nuevoCapitan.setLocalidad(localidadRepository.findById(dto.getIdLocalidad()).orElse(null));
            }

            capitanRepository.saveAndFlush(nuevoCapitan);

            return ResponseEntity.ok().body("{\"mensaje\": \"Capitán creado con éxito\"}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error interno al crear capitán: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCapitan(@PathVariable Integer id, @RequestBody PersonalLogisticaDTO dto) {
        try {
            Capitan cap = capitanRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Capitán no encontrado"));

            cap.setNombre(dto.getNombre());
            cap.setApellidos(dto.getApellidos());
            cap.setEmail(dto.getEmail());
            cap.setTelefono(dto.getTelefono());

            if (dto.getIdLocalidad() != null) {
                cap.setLocalidad(localidadRepository.findById(dto.getIdLocalidad()).orElse(null));
            }

            capitanRepository.save(cap);
            return ResponseEntity.ok().body("{\"mensaje\": \"Capitán actualizado con éxito\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarCapitan(@PathVariable Integer id) {
        try {
            Capitan cap = capitanRepository.findById(id).orElse(null);
            if (cap != null) {
                capitanRepository.delete(cap);
                return ResponseEntity.ok().body("{\"mensaje\": \"Capitán borrado con éxito\"}");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al borrar: No se puede eliminar si está asignado a tiendas.");
        }
    }
}