package pl.fkozlicki.quizlet.folder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.exception.DuplicateResourceException;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;
import pl.fkozlicki.quizlet.studyset.*;
import pl.fkozlicki.quizlet.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final FolderDTOMapper folderDTOMapper;
    private final StudySetRepository studySetRepository;
    private final StudySetDTOMapper studySetDTOMapper;

    public FolderDTO createFolder(FolderDTO folder, Integer userId) {
        Folder newFolder = folderRepository.save(Folder
                .builder()
                .name(folder.name())
                .description(folder.description())
                .user(userRepository
                        .findById(userId).orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find user with id %d".formatted(userId)))
                )
                .studySets(new ArrayList<>())
                .build()
        );

        return folderDTOMapper.apply(newFolder);
    }

    public FolderDTO editFolder(FolderDTO folder) {
        Folder folderToEdit = folderRepository
                .findById(folder.id())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find folder with id: %d".formatted(folder.id())
                ));

        folderToEdit.setName(folder.name());
        folderToEdit.setDescription(folder.description());
        Folder editedFolder = folderRepository.save(folderToEdit);

        return folderDTOMapper.apply(editedFolder);
    }

    public void deleteFolder(Integer id) {
        folderRepository.deleteById(id);
    }

    public List<StudySetDTO> addStudySetToFolder(Integer folderId, Integer studySetId) {
        Folder folder = folderRepository
                .findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't find folder with id %d".formatted(folderId)));

        StudySet studySet = studySetRepository
                .findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't find study set with id %d".formatted(studySetId)));

        if (folder.getStudySets().contains(studySet)) {
            throw new DuplicateResourceException("Folder already contains study set with id %d".formatted(studySetId));
        }

        List<StudySet> newStudySetList = folder.getStudySets();
        newStudySetList.add(studySet);
        folder.setStudySets(newStudySetList);

        folderRepository.save(folder);

        return folder.getStudySets()
                .stream()
                .map(studySetDTOMapper)
                .collect(Collectors.toList());
    }

    public List<StudySetDTO> removeStudySetFromFolder(Integer folderId, Integer studySetId) {
        Folder folder = folderRepository
                .findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't find folder with id %d".formatted(folderId)));

        StudySet studySet = studySetRepository
                .findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't find study set with id %d".formatted(studySetId)));

        if (!folder.getStudySets().contains(studySet)) {
            throw new ResourceNotFoundException("Folder doesn't contain study set with id %d".formatted(studySetId));
        }

        List<StudySet> studySets = folder.getStudySets();
        studySets.remove(studySet);
        folder.setStudySets(studySets);

        folderRepository.save(folder);

        return folder.getStudySets()
                .stream()
                .map(studySetDTOMapper)
                .collect(Collectors.toList());
    }

    public List<FolderDTO> getUserFolders(Integer userId) {
        return folderRepository
                .findByUserId(userId)
                .stream()
                .map(folderDTOMapper)
                .collect(Collectors.toList());
    }

    public FolderDTO getFolder(Integer id) {
        return folderDTOMapper.apply(folderRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find folder with id: %d".formatted(id)
                ))
        );
    }
}
