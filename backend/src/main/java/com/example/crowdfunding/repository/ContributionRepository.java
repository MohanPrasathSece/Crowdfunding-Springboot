package com.example.crowdfunding.repository;

import com.example.crowdfunding.model.Contribution;
import com.example.crowdfunding.model.Project;
import com.example.crowdfunding.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    List<Contribution> findByProject(Project project);
    List<Contribution> findByUser(User user);

    @Query("select distinct c.project from Contribution c where c.user = :user")
    List<Project> findDistinctProjectsByUser(User user);

    @Query("select c from Contribution c where c.project.owner = :owner")
    List<Contribution> findContributionsToOwnerProjects(User owner);
}
