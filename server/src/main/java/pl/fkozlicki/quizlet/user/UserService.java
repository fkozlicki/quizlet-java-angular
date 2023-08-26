package pl.fkozlicki.quizlet.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.fkozlicki.quizlet.exception.DuplicateResourceException;
import pl.fkozlicki.quizlet.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDTOMapper userDTOMapper;

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
}
