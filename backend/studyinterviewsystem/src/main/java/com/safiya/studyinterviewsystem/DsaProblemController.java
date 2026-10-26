
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
@RequestMapping("/api/dsa")
public class DsaProblemController {

    private final DsaProblemRepository dsaRepository;
    private final UserRepository userRepository;

    public DsaProblemController(
            DsaProblemRepository dsaRepository,
            UserRepository userRepository) {
        this.dsaRepository = dsaRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in first.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found."));
    }

    @GetMapping
    public List<DsaProblem> getAllProblems() {
        User user = getLoggedInUser();
        return dsaRepository.findByUserId(user.getId());
    }

    @PostMapping
    public DsaProblem addProblem(@RequestBody DsaProblem problem) {
        User user = getLoggedInUser();

        problem.setId(null);
        problem.setSolved(false);
        problem.setUser(user);

        return dsaRepository.save(problem);
    }

    @PutMapping("/{id}")
    public DsaProblem updateProblem(
            @PathVariable Long id,
            @RequestBody DsaProblem updatedProblem) {

        User user = getLoggedInUser();

        DsaProblem problem = dsaRepository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "DSA problem not found."));

        problem.setSolved(updatedProblem.isSolved());

        return dsaRepository.save(problem);
    }

    @DeleteMapping("/{id}")
    public String deleteProblem(@PathVariable Long id) {
        User user = getLoggedInUser();

        DsaProblem problem = dsaRepository.findById(id)
                .filter(existing -> existing.getUser() != null
                        && existing.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "DSA problem not found."));

        dsaRepository.delete(problem);

        return "DSA problem deleted successfully!";
    }
}
