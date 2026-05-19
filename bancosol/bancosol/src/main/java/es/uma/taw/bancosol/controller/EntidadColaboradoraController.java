package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.dao.EntidadColaboradoraRepository;
import es.uma.taw.bancosol.entity.ContactoColaborador;
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

    @Autowired
    private EntidadColaboradoraRepository entidadColaboradora;

    @PostMapping
    public EntidadColaboradora crearColaborador(@RequestBody EntidadColaboradora nuevoColaborador) {

        // 1. Por seguridad, forzamos que todos los nuevos entren como "Pendiente"
        nuevoColaborador.setEstadoValidacion("Pendiente");

        // 2. Enlazamos los contactos con esta entidad para que la base de datos sepa de quién son
        if (nuevoColaborador.getContactos() != null) {
            for (ContactoColaborador contacto : nuevoColaborador.getContactos()) {
                contacto.setColaborador(nuevoColaborador);
            }
        }

        // 3. Guardamos todo en la base de datos (Supabase)
        return entidadColaboradora.save(nuevoColaborador);
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
