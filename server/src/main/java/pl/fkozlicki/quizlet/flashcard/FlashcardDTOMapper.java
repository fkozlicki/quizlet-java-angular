package pl.fkozlicki.quizlet.flashcard;

import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class FlashcardDTOMapper implements Function<Flashcard, FlashcardDTO> {
    @Override
    public FlashcardDTO apply(Flashcard flashcard) {
        return new FlashcardDTO(
                flashcard.getId(),
                flashcard.getTerm(),
                flashcard.getDefinition(),
                flashcard.getPlace()
        );
    }
}
