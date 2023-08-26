package pl.fkozlicki.quizlet.flashcard;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/flashcard")
@RequiredArgsConstructor
public class FlashcardController {
    private final FlashcardService flashcardService;

    @PutMapping("/edit")
    ResponseEntity<FlashcardDTO> editFlashcard(@RequestBody FlashcardDTO flashcard) {
        return ResponseEntity.ok().body(flashcardService.editFlashcard(flashcard));
    }
}
