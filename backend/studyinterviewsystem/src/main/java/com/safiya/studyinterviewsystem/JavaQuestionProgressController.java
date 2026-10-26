
package com.safiya.studyinterviewsystem;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/java-question-progress")
public class JavaQuestionProgressController {

    private final JavaQuestionProgressRepository progressRepository;
    private final UserRepository userRepository;

    public JavaQuestionProgressController(
            JavaQuestionProgressRepository progressRepository,
            UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
public List<Map<String, Object>> getProgress(
        Authentication authentication) {

    User user = getLoggedInUser(authentication);

    return progressRepository.findByUserId(user.getId())
            .stream()
            .map(progress -> Map.<String, Object>of(
                    "questionKey", progress.getQuestionKey(),
                    "reviewed", progress.isReviewed()
            ))
            .toList();
}

    @PutMapping("/{questionKey}")
    public ResponseEntity<?> updateProgress(
            @PathVariable String questionKey,
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {

        if (questionKey.isBlank() || questionKey.length() > 250) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid question key");
        }

        Boolean reviewed = request.get("reviewed");

        if (reviewed == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Reviewed status is required");
        }

        User user = getLoggedInUser(authentication);

        JavaQuestionProgress progress = progressRepository
                .findByUserIdAndQuestionKey(user.getId(), questionKey)
                .orElseGet(() -> {
                    JavaQuestionProgress newProgress =
                            new JavaQuestionProgress();
                    newProgress.setUser(user);
                    newProgress.setQuestionKey(questionKey);
                    return newProgress;
                });

        progress.setReviewed(reviewed);

        JavaQuestionProgress saved =
                progressRepository.save(progress);

        return ResponseEntity.ok(Map.of(
                "questionKey", saved.getQuestionKey(),
                "reviewed", saved.isReviewed()
        ));
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
