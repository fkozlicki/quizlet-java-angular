package pl.fkozlicki.quizlet.studyset;

import pl.fkozlicki.quizlet.flashcard.FlashcardDTO;
import pl.fkozlicki.quizlet.user.UserDTO;

import java.util.List;

public record StudySetDTO(
        Integer id,
        String title,
        String description,
        List<FlashcardDTO> flashcards,
        UserDTO user
) {
}
