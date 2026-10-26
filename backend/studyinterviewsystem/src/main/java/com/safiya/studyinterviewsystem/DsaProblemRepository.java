
package com.safiya.studyinterviewsystem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DsaProblemRepository
        extends JpaRepository<DsaProblem, Long> {

    List<DsaProblem> findByUserId(Long userId);
}
