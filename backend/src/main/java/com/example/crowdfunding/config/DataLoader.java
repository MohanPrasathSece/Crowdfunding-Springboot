package com.example.crowdfunding.config;

import com.example.crowdfunding.model.Project;
import com.example.crowdfunding.model.Role;
import com.example.crowdfunding.model.User;
import com.example.crowdfunding.repository.ProjectRepository;
import com.example.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create sample user if not exists
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User(
                "Admin User",
                "admin@example.com",
                passwordEncoder.encode("password"),
                Role.ROLE_ADMIN
            );
            userRepository.save(admin);

            // Create sample projects
            Project project1 = new Project(
                "Smart Water Bottle",
                "A revolutionary water bottle that tracks your hydration levels and reminds you to drink water.",
                "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
                new BigDecimal("50000"),
                LocalDate.now().plusDays(30),
                admin
            );

            Project project2 = new Project(
                "Eco-Friendly Packaging",
                "Biodegradable packaging solution to reduce plastic waste in e-commerce.",
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
                new BigDecimal("25000"),
                LocalDate.now().plusDays(45),
                admin
            );

            Project project3 = new Project(
                "Community Garden App",
                "Mobile app connecting urban gardeners to share resources and knowledge.",
                "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
                new BigDecimal("15000"),
                LocalDate.now().plusDays(60),
                admin
            );

            // Set some collected amounts
            project1.setCollectedAmount(new BigDecimal("12500"));
            project2.setCollectedAmount(new BigDecimal("8000"));
            project3.setCollectedAmount(new BigDecimal("3500"));

            projectRepository.save(project1);
            projectRepository.save(project2);
            projectRepository.save(project3);

            System.out.println("Sample data loaded successfully!");
        }
    }
}
