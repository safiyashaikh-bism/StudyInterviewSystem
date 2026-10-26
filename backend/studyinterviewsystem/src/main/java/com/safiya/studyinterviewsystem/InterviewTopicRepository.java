
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewTopicRepository
        extends JpaRepository<InterviewTopic, Long> {

    List<InterviewTopic> findByUserId(Long userId);
}
