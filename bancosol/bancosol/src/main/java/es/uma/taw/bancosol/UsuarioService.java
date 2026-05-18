package es.uma.taw.bancosol;

import es.uma.taw.bancosol.entity.Usuario;
import es.uma.taw.bancosol.dao.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario autenticar(String username, String password) {
        Optional<Usuario> oUsuario = usuarioRepository.findByUsername(username);

        if (oUsuario.isPresent()) {
            Usuario usuario = oUsuario.get();

            if (usuario.getActivo() && usuario.getPassword().equals(password)) {
                return usuario;
            }
        }
        return null;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}