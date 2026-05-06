package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Colaborador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import es.uma.taw.bancosol.ColaboradorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/colaboradores")
@CrossOrigin(origins = "*")
public class ColaboradorController {

    @Autowired
    private ColaboradorService colaboradorService;

    // Escucha las peticiones POST en http://localhost:8080/api/colaboradores
    @PostMapping
    public ResponseEntity<Colaborador> crearColaborador(@RequestBody Colaborador colaborador) {
        try {
            // Pasamos el JSON recibido a nuestro Servicio
            Colaborador nuevoColaborador = colaboradorService.guardarNuevoColaborador(colaborador);

            // Si todo va bien, devolvemos un código 200 (OK) al Frontend
            return ResponseEntity.ok(nuevoColaborador);
        } catch (Exception e) {
            // Si algo falla (ej. base de datos caída), devolvemos un error 400
            return ResponseEntity.badRequest().build();
        }
    }

    // Este metodo escucha peticiones GET en /api/colaboradores
    // y devuelve la lista completa de colaboradores
    @GetMapping
    public ResponseEntity<java.util.List<Colaborador>> obtenerTodosLosColaboradores() {
        try {
            // Usamos el repositorio que ya tienes para sacar todo de la base de datos
            java.util.List<Colaborador> lista = colaboradorService.obtenerTodos();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Colaborador> actualizarEstado(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            // Extraemos el estado que nos manda el frontend en el JSON
            String nuevoEstado = body.get("estado");
            Colaborador actualizado = colaboradorService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
