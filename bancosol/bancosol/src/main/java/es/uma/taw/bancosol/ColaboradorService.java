package es.uma.taw.bancosol;

import es.uma.taw.bancosol.entity.Colaborador;
import es.uma.taw.bancosol.entity.ContactoColaborador;
import es.uma.taw.bancosol.dao.ColaboradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ColaboradorService {

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    @Transactional
    public Colaborador guardarNuevoColaborador(Colaborador colaborador) {

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
    public java.util.List<Colaborador> obtenerTodos() {
        return colaboradorRepository.findAll();
    }

    // Añade esto en ColaboradorService.java
    public Colaborador cambiarEstado(Long id, String nuevoEstado) {
        // Buscamos al colaborador en la base de datos
        Colaborador colab = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colaborador no encontrado"));

        // Le cambiamos el estado y guardamos
        colab.setEstadoValidacion(nuevoEstado);
        return colaboradorRepository.save(colab);
    }
}