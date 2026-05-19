package es.uma.taw.bancosol;

import es.uma.taw.bancosol.entity.ContactoColaborador;
import es.uma.taw.bancosol.dao.EntidadColaboradoraRepository;
import es.uma.taw.bancosol.entity.EntidadColaboradora;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntidadColaboradoraService {

    @Autowired
    private EntidadColaboradoraRepository colaboradorRepository;

    @Transactional
    public EntidadColaboradora guardarNuevoColaborador(EntidadColaboradora colaborador) {
        colaborador.setEstadoValidacion("Pendiente");

        if (colaborador.getContactos() != null) {
            for (ContactoColaborador contacto : colaborador.getContactos()) {
                contacto.setColaborador(colaborador);
            }
        }

        return colaboradorRepository.save(colaborador);
    }

    public java.util.List<EntidadColaboradora> obtenerTodos() {
        return colaboradorRepository.findAll();
    }

    public EntidadColaboradora cambiarEstado(Long id, String nuevoEstado) {
        EntidadColaboradora colab = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colaborador no encontrado"));

        colab.setEstadoValidacion(nuevoEstado);
        return colaboradorRepository.save(colab);
    }
}