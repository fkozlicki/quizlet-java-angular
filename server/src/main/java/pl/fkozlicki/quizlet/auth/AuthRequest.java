package pl.fkozlicki.quizlet.auth;

public record AuthRequest(
        String email,
        String password
) {
}
