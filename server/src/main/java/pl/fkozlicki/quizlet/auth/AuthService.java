package pl.fkozlicki.quizlet.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.security.JWTService;
import pl.fkozlicki.quizlet.user.User;
import pl.fkozlicki.quizlet.user.UserDTOMapper;
import pl.fkozlicki.quizlet.user.UserService;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTService jwtService;
    private final UserDTOMapper userDTOMapper;

    public AuthResponse authenticate(AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userService.getUserByEmail(request.email());

        String jwt = jwtService.generateToken(user);

        return new AuthResponse(
                jwt,
                userDTOMapper.apply(user)
        );
    }
}
