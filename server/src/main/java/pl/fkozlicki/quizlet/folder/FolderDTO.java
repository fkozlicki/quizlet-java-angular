package pl.fkozlicki.quizlet.folder;

import pl.fkozlicki.quizlet.studyset.StudySetDTO;
import pl.fkozlicki.quizlet.user.UserDTO;

import java.util.List;

public record FolderDTO(
        Integer id,
        String name,
        String description,
        List<StudySetDTO> studySets,
        UserDTO user
) {
}
