package pl.fkozlicki.quizlet.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.fkozlicki.quizlet.security.JWTService;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        userService.createUser(userRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PutMapping("/edit")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok().body(userService.editUser(userDTO));
    }

    @PostMapping(
            value = "/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public void uploadUserProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader
    ) {
        String jwt = authHeader.substring(7);
        User user = userService.getUserByEmail(jwtService.extractUsername(jwt));

        userService.uploadUserProfileImage(user.getId(), file);
    }

    @GetMapping(
            value = "/profile-image/{imageUrl}",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public byte[] getUserProfileImage(@PathVariable String imageUrl) {
        return userService.getUserProfileImage(imageUrl);
    }

}
