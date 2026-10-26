
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
@RequestMapping("/api/tasks")
public class StudyTaskController {

    private final StudyTaskRepository taskRepository;
    private final UserRepository userRepository;

    public StudyTaskController(
            StudyTaskRepository taskRepository,
            UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in first.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found."));
    }

    @GetMapping
    public List<StudyTask> getTasks() {
        User user = getLoggedInUser();
        return taskRepository.findByUserId(user.getId());
    }

    @PostMapping
    public StudyTask addTask(@RequestBody StudyTask task) {
        User user = getLoggedInUser();

        task.setId(null);
        task.setCompleted(false);
        task.setUser(user);

        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public StudyTask updateTask(
            @PathVariable Long id,
            @RequestBody StudyTask updatedTask) {

        User user = getLoggedInUser();

        StudyTask task = taskRepository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found."));

        task.setCompleted(updatedTask.isCompleted());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        User user = getLoggedInUser();

        StudyTask task = taskRepository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found."));

        taskRepository.delete(task);

        return "Task deleted successfully!";
    }
}
