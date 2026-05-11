package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Cadena;
import es.uma.taw.bancosol.dao.CadenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cadenas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CadenaController {

    @Autowired
    private CadenaRepository cadenaRepository;

    @GetMapping
    public List<Cadena> listarCadenas() {
        return cadenaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Cadena> guardarCadena(@RequestBody Cadena cadena) {
        try {
            Cadena nueva = cadenaRepository.save(cadena);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCadena(@PathVariable Integer id) {
        try {
            cadenaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}