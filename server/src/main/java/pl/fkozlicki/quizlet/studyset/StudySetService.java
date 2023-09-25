package pl.fkozlicki.quizlet.studyset;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;
import pl.fkozlicki.quizlet.flashcard.Flashcard;
import pl.fkozlicki.quizlet.flashcard.FlashcardRepository;
import pl.fkozlicki.quizlet.user.User;
import pl.fkozlicki.quizlet.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySetService {
    private final StudySetRepository studySetRepository;
    private final StudySetDTOMapper studySetDTOMapper;
    private final UserRepository userRepository;
    private final FlashcardRepository flashcardRepository;

    public StudySetDTO createStudySet(StudySetDTO studySetDTO, Integer userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudySet savedSet = studySetRepository.save(
                StudySet.builder()
                .title(studySetDTO.title())
                .description(studySetDTO.description())
                .user(user)
                .folders(new ArrayList<>())
                .build()
        );

        List<Flashcard> savedFlashcards = flashcardRepository.saveAll(
                studySetDTO.flashcards()
                        .stream()
                        .map(flashcard -> Flashcard
                                .builder()
                                .term(flashcard.term())
                                .definition(flashcard.definition())
                                .place(flashcard.place())
                                .studySet(savedSet)
                                .build()
                        )
                        .collect(Collectors.toList())
        );

        savedSet.setFlashcards(savedFlashcards);

        return studySetDTOMapper.apply(savedSet);
    }

    public void deleteStudySet(Integer id) {
        studySetRepository.deleteById(id);
    }

    public List<StudySetDTO> getStudySetsByUserId(Integer userId) {
        List<StudySet> studySets = studySetRepository.findAllByUserId(userId);

        return studySets
                .stream()
                .map(studySetDTOMapper)
                .collect(Collectors.toList());
    }

    public StudySetDTO getStudySetById(Integer id) {
        Optional<StudySet> studySet = studySetRepository.findById(id);

        return studySet
                .map(studySetDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Study set with id %d not found".formatted(id)
                ));
    }

    @Transactional
    public StudySetDTO editStudySet(StudySetDTO studySet) {

        StudySet studySetToEdit = studySetRepository.
                findById(studySet.id())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Study set with id %d not found".formatted(studySet.id())
                ));


        studySetToEdit.setTitle(studySet.title());
        studySetToEdit.setDescription(studySet.description());

        studySetRepository.save(studySetToEdit);

        flashcardRepository.deleteAllByStudySetId(studySet.id());

        List<Flashcard> savedFlashcards = flashcardRepository.saveAll(
                studySet.flashcards()
                        .stream()
                        .map(flashcard -> Flashcard
                                .builder()
                                .term(flashcard.term())
                                .definition(flashcard.definition())
                                .place(flashcard.place())
                                .studySet(studySetToEdit)
                                .build()
                        )
                        .collect(Collectors.toList())
        );

        studySetToEdit.setFlashcards(savedFlashcards);

        return studySetDTOMapper.apply(studySetToEdit);
    }
}
