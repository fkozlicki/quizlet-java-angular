package pl.fkozlicki.quizlet.studyset;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;
import pl.fkozlicki.quizlet.flashcard.Flashcard;
import pl.fkozlicki.quizlet.flashcard.FlashcardDTO;
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

    private List<Flashcard> saveFlashcards(List<FlashcardDTO> flashcardDTOList) {
        return flashcardRepository.saveAll(
                flashcardDTOList.stream()
                        .map(flashcard -> Flashcard
                                .builder()
                                .term(flashcard.term())
                                .definition(flashcard.definition())
                                .place(flashcard.place())
                                .build()
                        )
                        .collect(Collectors.toList())
        );
    }

    public StudySetDTO createStudySet(StudySetDTO studySet, Integer userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudySet newStudySet = StudySet.builder()
                .title(studySet.title())
                .description(studySet.description())
                .user(user)
                .folders(new ArrayList<>())
                .build();


        List<Flashcard> flashcards = saveFlashcards(studySet.flashcards());

        newStudySet.setFlashcards(flashcards);

        return studySetDTOMapper.apply(studySetRepository.save(newStudySet));
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

    public StudySetDTO editStudySet(StudySetDTO studySet) {

        StudySet studySetToEdit = studySetRepository.
                findById(studySet.id())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Study set with id %d not found".formatted(studySet.id())
                ));


        studySetToEdit.setTitle(studySet.title());
        studySetToEdit.setDescription(studySet.description());

        flashcardRepository.deleteAllByStudySetId(studySet.id());

        List<Flashcard> flashcards = saveFlashcards(studySet.flashcards());

        studySetToEdit.setFlashcards(flashcards);

        return studySetDTOMapper.apply(studySetRepository.save(studySetToEdit));
    }
}
