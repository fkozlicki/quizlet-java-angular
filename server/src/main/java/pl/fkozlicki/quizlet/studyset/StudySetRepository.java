package pl.fkozlicki.quizlet.studyset;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudySetRepository extends JpaRepository<StudySet, Integer> {
    List<StudySet> findAllByUserId(Integer userId);
}
