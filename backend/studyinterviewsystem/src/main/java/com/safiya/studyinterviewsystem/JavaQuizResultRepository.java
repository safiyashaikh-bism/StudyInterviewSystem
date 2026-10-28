
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JavaQuizResultRepository
        extends JpaRepository<JavaQuizResult, Long> {

    List<JavaQuizResult> findByUserId(Long userId);
}
