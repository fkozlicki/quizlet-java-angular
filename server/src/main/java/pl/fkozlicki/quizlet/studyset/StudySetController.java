package pl.fkozlicki.quizlet.studyset;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.fkozlicki.quizlet.security.JWTService;
import pl.fkozlicki.quizlet.user.User;
import pl.fkozlicki.quizlet.user.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/study-set")
@RequiredArgsConstructor
public class StudySetController {
    private final StudySetService studySetService;
    private final JWTService jwtService;
    private final UserService userService;

    @PostMapping("/create")
    ResponseEntity<StudySetDTO> createStudySet(
            @RequestBody StudySetDTO studySetDTO,
            @RequestHeader("Authorization") String authHeader
    ) {
        String jwt = authHeader.substring(7);
        User user = userService.getUserByEmail(jwtService.extractUsername(jwt));

        return ResponseEntity.ok().body(studySetService.createStudySet(studySetDTO, user.getId()));
    }

    @GetMapping("/{id}")
    ResponseEntity<StudySetDTO> getStudySet(@PathVariable Integer id) {
        return ResponseEntity.ok().body(studySetService.getStudySetById(id));
    }

    @GetMapping("/list/{userId}")
    ResponseEntity<List<StudySetDTO>> getUserStudySets(@PathVariable Integer userId) {
        return ResponseEntity.ok().body(studySetService.getStudySetsByUserId(userId));
    }

    @PutMapping("/edit")
    ResponseEntity<StudySetDTO> editStudySet(@RequestBody StudySetDTO studySetDTO) {
        return ResponseEntity.ok().body(studySetService.editStudySet(studySetDTO));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteStudySet(@PathVariable Integer id) {
        studySetService.deleteStudySet(id);
        return ResponseEntity.ok().build();
    }

}
