package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.EntidadColaboradora;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import es.uma.taw.bancosol.EntidadColaboradoraService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/colaboradores")
@CrossOrigin(origins = "*")
public class EntidadColaboradoraController {

    @Autowired
    private EntidadColaboradoraService colaboradorService;

    @PostMapping
    public ResponseEntity<EntidadColaboradora> crearColaborador(@RequestBody EntidadColaboradora colaborador) {
        try {
            EntidadColaboradora nuevoColaborador = colaboradorService.guardarNuevoColaborador(colaborador);

            return ResponseEntity.ok(nuevoColaborador);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<java.util.List<EntidadColaboradora>> obtenerTodosLosColaboradores() {
        try {
            java.util.List<EntidadColaboradora> lista = colaboradorService.obtenerTodos();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<EntidadColaboradora> actualizarEstado(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            EntidadColaboradora actualizado = colaboradorService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
