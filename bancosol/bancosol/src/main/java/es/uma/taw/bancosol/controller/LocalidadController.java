package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.LocalidadRepository;
import es.uma.taw.bancosol.entity.Localidad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/localidades")
public class LocalidadController {

    @Autowired
    private LocalidadRepository localidadRepository;

    @GetMapping
    public ResponseEntity<List<Localidad>> obtenerTodas() {
        try {
            return ResponseEntity.ok(localidadRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}