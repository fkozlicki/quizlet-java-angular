package pl.fkozlicki.quizlet.folder;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.fkozlicki.quizlet.studyset.StudySet;
import pl.fkozlicki.quizlet.user.User;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToMany
    private List<StudySet> studySets;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
