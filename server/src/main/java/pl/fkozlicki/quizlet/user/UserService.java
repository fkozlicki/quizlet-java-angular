package pl.fkozlicki.quizlet.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.fkozlicki.quizlet.exception.DuplicateResourceException;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;
import pl.fkozlicki.quizlet.s3.S3Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDTOMapper userDTOMapper;
    private final S3Service s3Service;
    @Value("${application.bucket-name}")
    private String bucketName;

    public void createUser(UserRequest userRequest) {
        if (userRepository.existsByName(userRequest.name())) {
            throw new DuplicateResourceException("User with this name already exists.");
        }

        if (userRepository.existsByEmail(userRequest.email())) {
            throw new DuplicateResourceException("User with this email already exists.");
        }

        userRepository.save(
                User
                        .builder()
                        .name(userRequest.name())
                        .email(userRequest.email())
                        .password(passwordEncoder.encode(userRequest.password()))
                        .birthday(LocalDate.parse(userRequest.birthday(), DateTimeFormatter.ISO_DATE_TIME))
                        .build()
        );
    }

    public User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find user with email: %s".formatted(email)
                ));
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.
                findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find user with id: %d".formatted(id)
                ));

        return userDTOMapper.apply(user);
    }

    public void uploadUserProfileImage(Integer userId, MultipartFile file) {
        User user = userRepository.
                findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Couldn't find user with id: %d".formatted(userId)
                ));

        String profileImageId = UUID.randomUUID().toString();

        try {
            s3Service.putObject(
                    bucketName,
                    profileImageId,
                    file.getBytes()
            );

            user.setImageUrl(profileImageId);

            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image", e);
        }

    }
    public byte[] getUserProfileImage(String imageUrl) {

        return s3Service.getObject(
                bucketName,
                imageUrl
        );
    }
}
