package com.example.crowdfunding.config;

import com.example.crowdfunding.model.Role;
import com.example.crowdfunding.model.User;
import com.example.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DefaultUserCreator implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create a default user if it doesn't exist
        if (!userRepository.existsByEmail("test@example.com")) {
            User defaultUser = new User(
                "Test User",
                "test@example.com",
                passwordEncoder.encode("test123456"),
                Role.ROLE_USER
            );
            userRepository.save(defaultUser);
            System.out.println("Default user created: test@example.com / test123456");
        }
    }
}
