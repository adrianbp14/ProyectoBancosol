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

    @Autowired
    private CapitanRepository capitanRepository;

    // Ojo: si en tu controlador pasabas un Long, pon Long idCoordinador. Si era Integer, pon Integer.
    public void asignarCoordinador(Integer idTienda, Integer idCoordinador, Integer idCampana) {

        // 1. Buscamos Tienda y Campaña
        Tienda tienda = tiendaRepository.findById(idTienda)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
        Campana campana = campanaRepository.findById(idCampana)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        // 2. BUSCAMOS EL COORDINADOR (Esto es lo que faltaba en tu código)
        // (Asegúrate de tener @Autowired private CoordinadorRepository coordinadorRepository; arriba en el Service)
        Coordinador coordinador = coordinadorRepository.findById(idCoordinador)
                .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

        // 3. Creamos la "unión" en la tabla intermedia
        TiendaCampanaCoordinador nuevaAsignacion = new TiendaCampanaCoordinador();
        nuevaAsignacion.setTienda(tienda);
        nuevaAsignacion.setCampana(campana);

        // 4. GUARDAMOS LAS DOS COSAS PARA QUE SUPABASE NO PONGA NULL
        nuevaAsignacion.setCoordinador(coordinador);
        nuevaAsignacion.setUsuario(coordinador.getUsuario()); // Rellena también id_usuario si hace falta

        // 5. Guardamos la asignación
        asignacionRepository.save(nuevaAsignacion);
    }

    public void asignarCapitan(Integer idTienda, Integer idCapitan) {
        Tienda tienda = tiendaRepository.findById(idTienda)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

        Capitan capitan = capitanRepository.findById(idCapitan)
                .orElseThrow(() -> new RuntimeException("Capitán no encontrado"));

        // Usamos el campo id_usuario que ya tiene la Tienda para guardar al Capitán sin romper la BD
        tienda.setUsuario(capitan.getUsuario());
        tiendaRepository.save(tienda);
    }
}