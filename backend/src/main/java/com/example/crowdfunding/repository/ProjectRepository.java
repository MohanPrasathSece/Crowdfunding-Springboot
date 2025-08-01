package com.example.crowdfunding.repository;

import com.example.crowdfunding.model.Project;
import com.example.crowdfunding.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p JOIN FETCH p.owner")
    List<Project> findAllWithOwners();

    List<Project> findByOwner(User owner);
}
