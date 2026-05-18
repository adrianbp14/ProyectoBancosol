package es.uma.taw.bancosol.controller;

import es.uma.taw.bancosol.UsuarioService;
import es.uma.taw.bancosol.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");

        Usuario usuario = usuarioService.autenticar(username, password);

        if (usuario != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "TOKEN-FALSO-PARA-PRUEBAS"); 

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("puesto", usuario.getRol().getNombre_rol());
            userDetails.put("nombre", usuario.getNombre_completo());

            response.put("user", userDetails);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> listarUsuarios() {
        List<Usuario> lista = usuarioService.listarUsuarios();

        List<Map<String, Object>> respuesta = lista.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id_usuario", u.getId_usuario());
            map.put("nombre_completo", u.getNombre_completo());
            return map;
        }).toList();

        return ResponseEntity.ok(respuesta);
    }
}