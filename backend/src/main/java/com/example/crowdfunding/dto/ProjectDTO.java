package com.example.crowdfunding.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal goalAmount;
    private BigDecimal collectedAmount;
    private LocalDate deadline;
    private UserDTO owner;

    public ProjectDTO(Long id, String title, String description, String imageUrl, BigDecimal goalAmount, BigDecimal collectedAmount, LocalDate deadline, UserDTO owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.goalAmount = goalAmount;
        this.collectedAmount = collectedAmount;
        this.deadline = deadline;
        this.owner = owner;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(BigDecimal goalAmount) {
        this.goalAmount = goalAmount;
    }

    public BigDecimal getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }
}
