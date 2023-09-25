package pl.fkozlicki.quizlet.flashcard;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.fkozlicki.quizlet.studyset.StudySet;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String term;

    private String definition;

    private Integer place;

    @ManyToOne
    private StudySet studySet;
}
