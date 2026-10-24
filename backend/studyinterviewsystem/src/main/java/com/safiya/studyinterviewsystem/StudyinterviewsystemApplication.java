
package com.safiya.studyinterviewsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class StudyinterviewsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyinterviewsystemApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to Study & Interview Preparation System!";
    }
}
