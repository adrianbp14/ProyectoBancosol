package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.dao.TiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistica") // <--- Cambiamos la base de la ruta
@CrossOrigin(origins = "*")
public class LogisticaController {

    @Autowired
    private TiendaRepository tiendaRepository;

    @GetMapping("/tiendas") // <--- Ahora la ruta completa será /api/logistica/tiendas
    public List<Tienda> obtenerTodasLasTiendas() {
        return tiendaRepository.findAll();
    }
}