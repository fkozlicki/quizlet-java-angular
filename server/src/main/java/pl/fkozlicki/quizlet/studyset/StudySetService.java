package pl.fkozlicki.quizlet.studyset;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;
import pl.fkozlicki.quizlet.flashcard.Flashcard;
import pl.fkozlicki.quizlet.flashcard.FlashcardPart;
import pl.fkozlicki.quizlet.flashcard.FlashcardRepository;
import pl.fkozlicki.quizlet.user.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StudySetService {
    private final StudySetRepository studySetRepository;
    private final StudySetDTOMapper studySetDTOMapper;
    private final UserRepository userRepository;
    private final FlashcardRepository flashcardRepository;

    public StudySetDTO createStudySet(StudySetDTO studySet, Integer userId) {
        List<Flashcard> flashcards = flashcardRepository.saveAll(
                studySet
                        .flashcards()
                        .stream()
                        .map(flashcard -> Flashcard
                                .builder()
                                .term(flashcard.term())
                                .definition(flashcard.definition())
                                .build()
                        )
                        .collect(Collectors.toList())
        );

        StudySet newStudySet = studySetRepository.save(
                StudySet.
                        builder()
                        .title(studySet.title())
                        .description(studySet.description())
                        .flashcards(flashcards)
                        .user(userRepository
                                .findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException(""))
                        )
                        .folders(new ArrayList<>())
                        .build()
        );

        return studySetDTOMapper.apply(newStudySet);
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
        studySetToEdit.setFlashcards(studySet
                .flashcards()
                .stream()
                .map(flashcardDTO -> Flashcard
                        .builder()
                        .id(flashcardDTO.id())
                        .term(flashcardDTO.term())
                        .definition(flashcardDTO.definition())
                        .build()
                )
                .collect(Collectors.toList()));

        StudySet editedStudySet = studySetRepository.save(studySetToEdit);

        return studySetDTOMapper.apply(editedStudySet);
    }

    public List<FlashcardPart> getMatchCards(Integer studySetId) {
        int MATCH_CARDS_COUNT = 3;

        List<Flashcard> allFlashcards = studySetRepository
                .findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Study set with id %d not found".formatted(studySetId)
                ))
                .getFlashcards();

        Collections.shuffle(allFlashcards);

        List<FlashcardPart> matchCards = allFlashcards
                .subList(0, allFlashcards.size() == 2 ? 2 : MATCH_CARDS_COUNT)
                .stream()
                .flatMap(flashcard -> Stream.of(
                        new FlashcardPart(flashcard.getId(), flashcard.getTerm()),
                        new FlashcardPart(flashcard.getId(), flashcard.getDefinition())
                ))
                .collect(Collectors.toList());

        Collections.shuffle(matchCards);

        return  matchCards;
    }



    public Test getTest(Integer studySetId) {

    }

}
