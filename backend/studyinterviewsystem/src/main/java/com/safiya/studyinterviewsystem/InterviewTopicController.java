
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
@RequestMapping("/api/interview-topics")
public class InterviewTopicController {

    private final InterviewTopicRepository repository;
    private final UserRepository userRepository;

    public InterviewTopicController(
            InterviewTopicRepository repository,
            UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in first.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found."));
    }

    @GetMapping
    public List<InterviewTopic> getAllTopics() {
        User user = getLoggedInUser();
        return repository.findByUserId(user.getId());
    }

    @PostMapping
    public InterviewTopic addTopic(@RequestBody InterviewTopic topic) {
        User user = getLoggedInUser();

        topic.setId(null);
        topic.setUser(user);

        if (topic.getCompleted() == null) {
            topic.setCompleted(false);
        }

        return repository.save(topic);
    }

    @PutMapping("/{id}")
    public InterviewTopic updateTopic(
            @PathVariable Long id,
            @RequestBody InterviewTopic updatedTopic) {

        User user = getLoggedInUser();

        InterviewTopic topic = repository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Interview topic not found."));

        topic.setCompleted(updatedTopic.getCompleted());

        return repository.save(topic);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        User user = getLoggedInUser();

        InterviewTopic topic = repository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Interview topic not found."));

        repository.delete(topic);
    }
}
