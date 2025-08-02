package com.example.crowdfunding.controller;

import com.example.crowdfunding.dto.ProjectDTO;
import com.example.crowdfunding.dto.UserDTO;
import com.example.crowdfunding.model.Project;
import com.example.crowdfunding.model.Role;
import com.example.crowdfunding.model.User;
import com.example.crowdfunding.repository.ProjectRepository;
import com.example.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.example.crowdfunding.dto.ProjectUpdateRequest;
import java.util.Map;
import com.example.crowdfunding.model.Contribution;
import com.example.crowdfunding.repository.ContributionRepository;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContributionRepository contributionRepository;

    @GetMapping("/my-projects")
    public List<ProjectDTO> getMyOwnProjects(Authentication authentication) {
        if (authentication == null) {
            return List.of();
        }
        
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return List.of();
        return projectRepository.findByOwner(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ProjectDTO convertToDto(Project project) {
        UserDTO ownerDto = null;
        if (project.getOwner() != null) {
            ownerDto = new UserDTO(
                    project.getOwner().getId(),
                    project.getOwner().getName(),
                    project.getOwner().getEmail()
            );
        }

        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getImageUrl(),
                project.getGoalAmount(),
                project.getCollectedAmount(),
                project.getDeadline(),
                ownerDto
        );
    }

    @GetMapping("/{id}/donors")
    public ResponseEntity<?> getProjectDonors(@PathVariable Long id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();
        List<Contribution> contributions = contributionRepository.findByProject(project);
        return ResponseEntity.ok(contributions.stream().map(c -> Map.of(
            "name", c.getUser().getName(),
            "amount", c.getAmount(),
            "date", c.getContributedAt()
        )));
    }

    @GetMapping("/{id}/donations")
    public ResponseEntity<?> getProjectDonations(@PathVariable Long id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();
        List<Contribution> contributions = contributionRepository.findByProject(project);
        return ResponseEntity.ok(contributions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id,
                                           @RequestBody ProjectUpdateRequest req) {
        try {
            Project project = projectRepository.findById(id).orElse(null);
            if (project == null) return ResponseEntity.notFound().build();

            if (req.getTitle() != null) project.setTitle(req.getTitle());
            if (req.getDescription() != null) project.setDescription(req.getDescription());
            if (req.getImageUrl() != null) project.setImageUrl(req.getImageUrl());
            if (req.getGoalAmount() != null) project.setGoalAmount(req.getGoalAmount());
            if (req.getDeadline() != null) project.setDeadline(req.getDeadline());
            projectRepository.save(project);
            return ResponseEntity.ok(convertToDto(project));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            Project project = projectRepository.findById(id).orElse(null);
            if (project == null) return ResponseEntity.notFound().build();
            contributionRepository.deleteAll(contributionRepository.findByProject(project));
            projectRepository.delete(project);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody CreateProjectRequest request, Authentication authentication) {
        try {
            User owner;
            if (authentication != null && authentication.isAuthenticated()) {
                owner = userRepository.findByEmail(authentication.getName()).orElse(null);
            } else {
                owner = null;
            }

            Project project = new Project(
                request.getTitle(),
                request.getDescription(),
                request.getImageUrl(),
                request.getGoalAmount(),
                request.getDeadline(),
                owner
            );
            
            projectRepository.save(project);
            return ResponseEntity.ok(Map.of("message", "Project created successfully"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    

    

    @PostMapping("/{id}/pledge")
    public ResponseEntity<?> pledgeToProject(@PathVariable Long id, @RequestBody PledgeRequest request) {
        try {
            Project project = projectRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            
            project.setCollectedAmount(project.getCollectedAmount().add(request.getAmount()));
            projectRepository.save(project);
            
            return ResponseEntity.ok(Map.of("message", "Pledge successful"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    public static class CreateProjectRequest {
        private String title;
        private String description;
        private String imageUrl;
        private BigDecimal goalAmount;
        private LocalDate deadline;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public BigDecimal getGoalAmount() { return goalAmount; }
        public void setGoalAmount(BigDecimal goalAmount) { this.goalAmount = goalAmount; }

        public LocalDate getDeadline() { return deadline; }
        public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    }

    public static class PledgeRequest {
        private BigDecimal amount;

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}
