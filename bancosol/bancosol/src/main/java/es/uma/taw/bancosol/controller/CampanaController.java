package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Campana;
import es.uma.taw.bancosol.dao.CampanaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campanas")
@CrossOrigin(origins = "*")
public class CampanaController {

    @Autowired
    private CampanaRepository campanaRepository;

    @GetMapping
    public List<Campana> listarCampanas() {
        return campanaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Campana> guardarCampana(@RequestBody Campana campana) {
        try {
            Campana nueva = campanaRepository.save(campana);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}