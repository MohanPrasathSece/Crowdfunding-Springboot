package com.example.crowdfunding.controller;

import com.example.crowdfunding.model.Contribution;
import com.example.crowdfunding.model.Project;
import com.example.crowdfunding.model.Role;
import com.example.crowdfunding.model.User;
import com.example.crowdfunding.repository.ContributionRepository;
import com.example.crowdfunding.repository.ProjectRepository;
import com.example.crowdfunding.repository.UserRepository;

import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contributions")
@CrossOrigin(origins = "http://localhost:3000")
public class ContributionController {

    @Autowired
    private ContributionRepository contributionRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> contribute(@RequestBody ContributionRequest request, Authentication auth) {
        try {
            // For now, since auth is disabled, we'll create a dummy user
            User user = userRepository.findByEmail("dummy@example.com")
                    .orElseGet(() -> {
                        User newUser = new User("Dummy User", "dummy@example.com", "password", Role.ROLE_USER);
                        return userRepository.save(newUser);
                    });

            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            Contribution contribution = new Contribution(request.getAmount(), user, project);
            contributionRepository.save(contribution);

            // Update project collected amount
            project.setCollectedAmount(project.getCollectedAmount().add(request.getAmount()));
            projectRepository.save(project);

            return ResponseEntity.ok(Map.of("message", "Contribution successful"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/my-campaign-donations")
    public List<Contribution> donationsToMyCampaigns(Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (owner == null) return List.of();
        return contributionRepository.findContributionsToOwnerProjects(owner);
    }

    @GetMapping("/my-projects")
    public List<Project> myContributionProjects(Authentication authentication) {
        if (authentication == null) {
            System.out.println("[DEBUG] No authentication provided to /my-projects endpoint");
            return List.of();
        }
        System.out.println("[DEBUG] /my-projects called by: " + authentication.getName());
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            System.out.println("[DEBUG] No user found for email: " + authentication.getName());
            return List.of();
        }
        return contributionRepository.findDistinctProjectsByUser(user);
    }

    @GetMapping("/me")
    public List<Contribution> myContributions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return List.of();
        return contributionRepository.findByUser(user);
    }

    @GetMapping("/by-campaign/{projectId}")
    public List<Contribution> getContributionsByCampaign(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return List.of();
        return contributionRepository.findByProject(project);
    }

    public static class ContributionRequest {
        private Long projectId;
        private BigDecimal amount;

        // Getters and setters
        public Long getProjectId() { return projectId; }
        public void setProjectId(Long projectId) { this.projectId = projectId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}
