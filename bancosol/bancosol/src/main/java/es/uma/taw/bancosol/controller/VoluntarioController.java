package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Voluntario;
import es.uma.taw.bancosol.dao.VoluntarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voluntarios")
@CrossOrigin(origins = "*") // Ajusta esto según tu configuración de seguridad/CORS
public class VoluntarioController {

    @Autowired
    private VoluntarioRepository voluntarioRepository;

    @GetMapping
    public ResponseEntity<List<Voluntario>> obtenerTodos() {
        return ResponseEntity.ok(voluntarioRepository.findAll());
    }
}