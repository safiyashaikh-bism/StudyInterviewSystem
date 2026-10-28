
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/java-practice")
public class JavaPracticeController {

    private final JavaPracticeRepository practiceRepository;
    private final UserRepository userRepository;

    public JavaPracticeController(
            JavaPracticeRepository practiceRepository,
            UserRepository userRepository) {
        this.practiceRepository = practiceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<JavaPractice> getProblems(
            Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return practiceRepository.findByUserId(user.getId());
    }

    @PostMapping
    public JavaPractice addProblem(
            @RequestBody JavaPractice problem,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        if (problem.getName() == null
                || problem.getName().isBlank()
                || problem.getName().length() > 250) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a valid Java question name");
        }

        if (!List.of("Easy", "Medium", "Hard")
                .contains(problem.getDifficulty())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid difficulty");
        }

        problem.setId(null);
        problem.setName(problem.getName().trim());
        problem.setSolved(false);
        problem.setUser(user);

        return practiceRepository.save(problem);
    }

    @PutMapping("/{id}")
    public JavaPractice updateProblem(
            @PathVariable Long id,
            @RequestBody JavaPractice request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);
        JavaPractice problem = findUserProblem(id, user.getId());

        problem.setSolved(Boolean.TRUE.equals(request.isSolved()));

        return practiceRepository.save(problem);
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);
        JavaPractice problem = findUserProblem(id, user.getId());

        practiceRepository.delete(problem);
    }

    private JavaPractice findUserProblem(Long id, Long userId) {
        return practiceRepository.findById(id)
                .filter(problem -> problem.getUser() != null
                        && problem.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Java question not found"));
    }

    private User getLoggedInUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in");
        }

        return userRepository.findByEmail(
                authentication.getName().trim().toLowerCase()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
