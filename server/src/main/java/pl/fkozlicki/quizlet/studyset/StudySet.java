package pl.fkozlicki.quizlet.studyset;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.fkozlicki.quizlet.flashcard.Flashcard;
import pl.fkozlicki.quizlet.folder.Folder;
import pl.fkozlicki.quizlet.user.User;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudySet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    private String description;
    @OneToMany(cascade = CascadeType.REMOVE)

    @OrderBy("place  ASC")
    private List<Flashcard> flashcards;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(mappedBy = "studySets")
    private List<Folder> folders;

    @PreRemove
    private void removeStudySetFromFolders() {
        for (Folder folder : folders) {
            folder.getStudySets().remove(this);
        }
    }
}
