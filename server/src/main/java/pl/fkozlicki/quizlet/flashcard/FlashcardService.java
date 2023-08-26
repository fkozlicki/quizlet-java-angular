package pl.fkozlicki.quizlet.flashcard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FlashcardService {
    private final FlashcardRepository flashcardRepository;
    private final FlashcardDTOMapper flashcardDTOMapper;

    public FlashcardDTO editFlashcard(FlashcardDTO flashcard) {
        Flashcard editedFlashcard = flashcardRepository.save(Flashcard
                .builder()
                .id(flashcard.id())
                .term(flashcard.term())
                .definition(flashcard.definition())
                .build()
        );
        return flashcardDTOMapper.apply(editedFlashcard);
    }
}
