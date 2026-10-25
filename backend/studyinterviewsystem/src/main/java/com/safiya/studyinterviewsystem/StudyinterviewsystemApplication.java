package com.safiya.studyinterviewsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class StudyinterviewsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyinterviewsystemApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to Study & Interview Preparation System!";
    }

    @GetMapping("/api/test")
    public String testApi() {
        return "StudyHub API is working!";
    }
}