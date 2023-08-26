package pl.fkozlicki.quizlet.user;

public record UserRequest(
        String name,
        String email,
        String password,
        String birthday
) {

}
