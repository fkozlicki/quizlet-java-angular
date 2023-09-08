package pl.fkozlicki.quizlet.folder;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.fkozlicki.quizlet.security.JWTService;
import pl.fkozlicki.quizlet.studyset.StudySetDTO;
import pl.fkozlicki.quizlet.user.User;
import pl.fkozlicki.quizlet.user.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/folder")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;
    private final JWTService jwtService;
    private final UserService userService;

    @PostMapping("/create")
    ResponseEntity<FolderDTO> createFolder(
            @RequestBody FolderDTO folder,
           @RequestHeader("Authorization") String authHeader
    ) {
        String jwt = authHeader.substring(7);
        User user = userService.getUserByEmail(jwtService.extractUsername(jwt));

        return ResponseEntity.ok().body(folderService.createFolder(folder, user.getId()));
    }

    @PutMapping("/edit")
    ResponseEntity<FolderDTO> editFolder(
            @RequestBody FolderDTO folder
    ) {
        return ResponseEntity.ok().body(folderService.editFolder(folder));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteFolder(@PathVariable Integer id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add-set")
    ResponseEntity<List<StudySetDTO>> addStudySetToFolder(
            @RequestParam Integer folderId,
            @RequestParam Integer studySetId
    ) {
        return ResponseEntity.ok().body(folderService.addStudySetToFolder(folderId, studySetId));
    }

    @PostMapping("/remove-set")
    ResponseEntity<List<StudySetDTO>> removeStudySetFromFolder(
            @RequestParam Integer folderId,
            @RequestParam Integer studySetId
    ) {
        return ResponseEntity.ok().body(folderService.removeStudySetFromFolder(folderId, studySetId));
    }

    @GetMapping("/list/{userId}")
    ResponseEntity<List<FolderDTO>> getUserFolders(@PathVariable Integer userId) {
        return ResponseEntity.ok().body(folderService.getUserFolders(userId));
    }

    @GetMapping("/{id}")
    ResponseEntity<FolderDTO> getFolder(@PathVariable Integer id) {
        return ResponseEntity.ok().body(folderService.getFolder(id));
    }

}
