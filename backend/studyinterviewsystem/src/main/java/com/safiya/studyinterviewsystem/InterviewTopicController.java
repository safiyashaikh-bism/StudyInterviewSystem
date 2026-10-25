
package com.safiya.studyinterviewsystem;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interview-topics")
@CrossOrigin(origins = "*")
public class InterviewTopicController {

    private final InterviewTopicRepository repository;

    public InterviewTopicController(InterviewTopicRepository repository) {
        this.repository = repository;
    }

    // Get all interview topics
    @GetMapping
    public List<InterviewTopic> getAllTopics() {
        return repository.findAll();
    }

    // Add a new interview topic
    @PostMapping
    public InterviewTopic addTopic(@RequestBody InterviewTopic topic) {
        topic.setId(null);
        if (topic.getCompleted() == null) {
            topic.setCompleted(false);
        }
        return repository.save(topic);
    }

    // Update an interview topic
    @PutMapping("/{id}")
    public InterviewTopic updateTopic(
            @PathVariable Long id,
            @RequestBody InterviewTopic updatedTopic) {

        InterviewTopic topic = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Interview topic not found"));

        topic.setCompleted(updatedTopic.getCompleted());

        return repository.save(topic);
    }

    // Delete an interview topic
    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
