package pl.fkozlicki.quizlet.studyset;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.flashcard.FlashcardDTOMapper;
import pl.fkozlicki.quizlet.user.UserDTOMapper;

import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySetDTOMapper implements Function<StudySet, StudySetDTO> {
    private final FlashcardDTOMapper flashcardDTOMapper;
    private final UserDTOMapper userDTOMapper;

    @Override
    public StudySetDTO apply(StudySet studySet) {
        return new StudySetDTO(
                studySet.getId(),
                studySet.getTitle(),
                studySet.getDescription(),
                studySet.getFlashcards()
                        .stream()
                        .map(flashcardDTOMapper)
                        .collect(Collectors.toList()),
                userDTOMapper.apply(studySet.getUser())
        );
    }
}
