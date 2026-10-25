
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
@RequestMapping("/api/dsa")
@CrossOrigin(origins = "*")
public class DsaProblemController {

    private final DsaProblemRepository dsaRepository;

    public DsaProblemController(DsaProblemRepository dsaRepository) {
        this.dsaRepository = dsaRepository;
    }

    @GetMapping
    public List<DsaProblem> getAllProblems() {
        return dsaRepository.findAll();
    }

    @PostMapping
    public DsaProblem addProblem(@RequestBody DsaProblem problem) {
        problem.setId(null);
        problem.setSolved(false);
        return dsaRepository.save(problem);
    }

    @PutMapping("/{id}")
    public DsaProblem updateProblem(
            @PathVariable Long id,
            @RequestBody DsaProblem updatedProblem) {

        DsaProblem problem = dsaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "DSA problem not found"));

        problem.setSolved(updatedProblem.isSolved());

        return dsaRepository.save(problem);
    }

    @DeleteMapping("/{id}")
    public String deleteProblem(@PathVariable Long id) {
        DsaProblem problem = dsaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "DSA problem not found"));

        dsaRepository.delete(problem);

        return "DSA problem deleted successfully!";
    }
}
