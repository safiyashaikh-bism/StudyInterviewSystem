
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JavaPracticeRepository
        extends JpaRepository<JavaPractice, Long> {

    List<JavaPractice> findByUserId(Long userId);
}
