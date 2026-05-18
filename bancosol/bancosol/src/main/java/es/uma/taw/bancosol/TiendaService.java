package es.uma.taw.bancosol;

import es.uma.taw.bancosol.dao.CampanaRepository;
import es.uma.taw.bancosol.dao.TiendaCampanaCoordinadorRepository;
import es.uma.taw.bancosol.entity.Campana;
import es.uma.taw.bancosol.entity.Tienda;
import es.uma.taw.bancosol.entity.TiendaCampanaCoordinador;
import es.uma.taw.bancosol.entity.Usuario;
import es.uma.taw.bancosol.dao.TiendaRepository;
import es.uma.taw.bancosol.dao.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TiendaService {

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CampanaRepository campanaRepository; // <--- NUEVO

    @Autowired
    private TiendaCampanaCoordinadorRepository asignacionRepository;


    public void asignarCoordinador(Integer idTienda, Long idUsuario, Integer idCampana) {
        // 1. Buscamos las tres piezas en la base de datos
        Tienda tienda = tiendaRepository.findById(idTienda)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Campana campana = campanaRepository.findById(idCampana)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        // 2. Creamos la "unión" en la tabla intermedia
        TiendaCampanaCoordinador nuevaAsignacion = new TiendaCampanaCoordinador();
        nuevaAsignacion.setTienda(tienda);
        nuevaAsignacion.setUsuario(usuario);
        nuevaAsignacion.setCampana(campana);

        // 3. Guardamos la asignación
        asignacionRepository.save(nuevaAsignacion);
    }
}