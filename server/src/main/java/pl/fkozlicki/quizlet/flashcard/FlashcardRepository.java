package pl.fkozlicki.quizlet.flashcard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Integer> {
    void deleteAllByStudySetId(Integer studySetId);
}
