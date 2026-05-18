package es.uma.taw.bancosol;

import es.uma.taw.bancosol.dao.*;
import es.uma.taw.bancosol.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TiendaService {

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CampanaRepository campanaRepository;

    @Autowired
    private TiendaCampanaCoordinadorRepository asignacionRepository;

    @Autowired
    private CoordinadorRepository coordinadorRepository;



    public void asignarCoordinador(Integer idTienda, Integer idCoordinador, Integer idCampana) {
        Tienda tienda = tiendaRepository.findById(idTienda)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
        Campana campana = campanaRepository.findById(idCampana)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        Coordinador coordinador = coordinadorRepository.findById(idCoordinador)
                .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

        TiendaCampanaCoordinador nuevaAsignacion = new TiendaCampanaCoordinador();
        nuevaAsignacion.setTienda(tienda);
        nuevaAsignacion.setCampana(campana);

        nuevaAsignacion.setCoordinador(coordinador);
        nuevaAsignacion.setUsuario(coordinador.getUsuario());

        asignacionRepository.save(nuevaAsignacion);
    }
}