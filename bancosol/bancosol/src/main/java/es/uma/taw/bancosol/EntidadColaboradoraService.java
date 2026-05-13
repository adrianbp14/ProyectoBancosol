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

        // 1. Aplicamos la regla de negocio
        colaborador.setEstadoValidacion("Pendiente");

        // 2. Nos aseguramos de que todos los contactos que vienen en el JSON
        // sepan a qué colaborador pertenecen (Relación bidireccional)
        if (colaborador.getContactos() != null) {
            for (ContactoColaborador contacto : colaborador.getContactos()) {
                contacto.setColaborador(colaborador);
            }
        }

        // 3. Guardamos en la base de datos (Esto guarda el colaborador Y sus contactos a la vez)
        return colaboradorRepository.save(colaborador);
    }

    // Añade esto en tu ColaboradorService.java
    public java.util.List<EntidadColaboradora> obtenerTodos() {
        return colaboradorRepository.findAll();
    }

    // Añade esto en ColaboradorService.java
    public EntidadColaboradora cambiarEstado(Long id, String nuevoEstado) {
        // Buscamos al colaborador en la base de datos
        EntidadColaboradora colab = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colaborador no encontrado"));

        // Le cambiamos el estado y guardamos
        colab.setEstadoValidacion(nuevoEstado);
        return colaboradorRepository.save(colab);
    }
}