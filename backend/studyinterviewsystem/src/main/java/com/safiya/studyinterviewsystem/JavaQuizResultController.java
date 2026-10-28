
package com.safiya.studyinterviewsystem;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/java-quiz-results")
public class JavaQuizResultController {

    private final JavaQuizResultRepository resultRepository;
    private final UserRepository userRepository;

    public JavaQuizResultController(
            JavaQuizResultRepository resultRepository,
            UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<JavaQuizResult> getResults(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return resultRepository.findByUserId(user.getId());
    }

    @PostMapping
    public JavaQuizResult saveResult(
            @RequestBody JavaQuizResult request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        if (request.getScore() < 0
                || request.getTotalQuestions() <= 0
                || request.getScore() > request.getTotalQuestions()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid quiz score");
        }

        JavaQuizResult result = new JavaQuizResult();
        result.setScore(request.getScore());
        result.setTotalQuestions(request.getTotalQuestions());
        result.setTopic(request.getTopic());
        result.setAttemptedAt(LocalDateTime.now());
        result.setUser(user);

        return resultRepository.save(result);
    }

    private User getLoggedInUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in first");
        }

        return userRepository.findByEmail(
                authentication.getName().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
