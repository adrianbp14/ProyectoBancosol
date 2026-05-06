package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.dao.TiendaRepository;
import es.uma.taw.bancosol.dto.TiendaMapaDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // Añadido

@RestController
@RequestMapping("/api/tiendas")
@CrossOrigin(origins = "*")
public class TiendaController {

    @Autowired
    private TiendaRepository tiendaRepository;

    @GetMapping
    public ResponseEntity<List<TiendaMapaDTO>> listarTiendasParaMapa() {
        List<Tienda> tiendas = tiendaRepository.findAll();

        // Transformamos la lista de Entidades en una lista de DTOs para el frontend
        List<TiendaMapaDTO> response = tiendas.stream().map(t -> {
            TiendaMapaDTO dto = new TiendaMapaDTO();
            dto.setId(t.getId_tienda()); // Ajustado al nombre del ID en tu entidad
            dto.setNombre(t.getResenaNombre());
            dto.setDomicilio(t.getDomicilio());

            // Verificamos si tiene localidad para evitar NullPointerException
            if (t.getLocalidad() != null) {
                dto.setLocalidad(t.getLocalidad().getNombre());
            }

            dto.setLatitud(t.getLatitud());
            dto.setLongitud(t.getLongitud());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}