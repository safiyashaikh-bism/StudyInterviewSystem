
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyTaskRepository extends JpaRepository<StudyTask, Long> {

    List<StudyTask> findByUserId(Long userId);
}
