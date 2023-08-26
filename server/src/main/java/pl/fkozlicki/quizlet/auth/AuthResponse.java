package pl.fkozlicki.quizlet.auth;

import pl.fkozlicki.quizlet.user.UserDTO;

public record AuthResponse(
        String token,
        UserDTO user
) {
}
