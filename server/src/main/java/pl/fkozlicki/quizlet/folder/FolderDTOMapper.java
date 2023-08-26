package pl.fkozlicki.quizlet.folder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.studyset.StudySetDTOMapper;
import pl.fkozlicki.quizlet.user.UserDTOMapper;

import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderDTOMapper implements Function<Folder, FolderDTO> {
    private final StudySetDTOMapper studySetDTOMapper;
    private final UserDTOMapper userDTOMapper;

    @Override
    public FolderDTO apply(Folder folder) {
        return new FolderDTO(
                folder.getId(),
                folder.getName(),
                folder.getDescription(),
                folder.getStudySets()
                        .stream()
                        .map(studySetDTOMapper)
                        .collect(Collectors.toList()),
                userDTOMapper.apply(folder.getUser())
        );
    }
}
