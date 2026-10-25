
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")
public class StudyTaskController {

    private final StudyTaskRepository taskRepository;

    public StudyTaskController(StudyTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<StudyTask> getTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public StudyTask addTask(@RequestBody StudyTask task) {
        task.setId(null);
        task.setCompleted(false);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public StudyTask updateTask(
            @PathVariable Long id,
            @RequestBody StudyTask updatedTask) {

        StudyTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found with id: " + id));

        task.setCompleted(updatedTask.isCompleted());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        StudyTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found with id: " + id));

        taskRepository.delete(task);
        return "Task deleted successfully!";
    }
}
