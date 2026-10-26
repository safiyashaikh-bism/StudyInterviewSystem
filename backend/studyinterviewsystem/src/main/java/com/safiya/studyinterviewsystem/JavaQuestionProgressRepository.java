
package com.safiya.studyinterviewsystem;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JavaQuestionProgressRepository
        extends JpaRepository<JavaQuestionProgress, Long> {

    List<JavaQuestionProgress> findByUserId(Long userId);

    Optional<JavaQuestionProgress> findByUserIdAndQuestionKey(
            Long userId,
            String questionKey
    );
}
