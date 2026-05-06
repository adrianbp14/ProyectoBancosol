package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.repository.TiendaRepository;
import es.uma.taw.bancosol.dto.TiendaMapaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tiendas")
@CrossOrigin(origins = "*")
public class TiendaController {

    @Autowired
    private TiendaRepository tiendaRepository;

    @GetMapping
    public ResponseEntity<List<TiendaMapaDTO>> listarTiendasParaMapa() {
        List<Tienda> tiendas = tiendaRepository.findAll();

        List<TiendaMapaDTO> response = tiendas.stream().map(t -> {
            TiendaMapaDTO dto = new TiendaMapaDTO();
            dto.setId(t.getIdTienda());
            dto.setNombre(t.getResenaNombre());
            dto.setDomicilio(t.getDomicilio());

            // MAPEO DEL CÓDIGO POSTAL (Fundamental para que no salga N/A)
            dto.setCodigoPostal(t.getCodigoPostal());

            if (t.getLocalidad() != null) {
                // Ajusta 'getNombre()' al método real de tu entidad Localidad (ej: getNombreLocalidad)
                dto.setLocalidad(t.getLocalidad().getNombre());
            }

            dto.setLatitud(t.getLatitud());
            dto.setLongitud(t.getLongitud());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}