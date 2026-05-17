package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Voluntario;
import es.uma.taw.bancosol.dao.VoluntarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voluntarios")
@CrossOrigin(origins = "*")
public class VoluntarioController {

    @Autowired
    private VoluntarioRepository voluntarioRepository;

    // EL QUE YA TENÍAIS: Listar todos
    @GetMapping
    public ResponseEntity<List<Voluntario>> obtenerTodos() {
        return ResponseEntity.ok(voluntarioRepository.findAll());
    }

    // NUEVO 1: Registrar un voluntario desde el panel del coordinador
    @PostMapping
    public ResponseEntity<?> registrarVoluntario(@RequestBody Voluntario nuevoVoluntario) {
        try {
            Voluntario guardado = voluntarioRepository.save(nuevoVoluntario);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar el voluntario: " + e.getMessage());
        }
    }

    // NUEVO 2: Filtrar los voluntarios que están libres para ser asignados a turnos
    @GetMapping("/disponibles")
    public ResponseEntity<List<Voluntario>> obtenerDisponibles() {
        try {

            List<Voluntario> disponibles = voluntarioRepository.findAll();
            return ResponseEntity.ok(disponibles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}