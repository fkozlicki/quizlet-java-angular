package pl.fkozlicki.quizlet.user;

public record UserDTO(
        Integer id,
        String name,
        String email,
        String imageUrl
) {
}
