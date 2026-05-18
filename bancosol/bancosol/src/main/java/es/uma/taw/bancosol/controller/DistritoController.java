package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.DistritoRepository;
import es.uma.taw.bancosol.entity.Distrito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/distritos")
public class DistritoController {

    @Autowired
    private DistritoRepository distritoRepository;

    @GetMapping
    public ResponseEntity<List<Distrito>> obtenerTodos() {
        try {
            List<Distrito> distritos = distritoRepository.findAll();
            return ResponseEntity.ok(distritos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}