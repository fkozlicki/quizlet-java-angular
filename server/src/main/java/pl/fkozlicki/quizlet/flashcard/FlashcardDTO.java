package pl.fkozlicki.quizlet.flashcard;

public record FlashcardDTO(
        Integer id,
        String term,
        String definition,
        Integer place
) {
}
