package com.cannabis.app.repository;

import com.cannabis.app.model.Organization;
import com.cannabis.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findBySlug(String slug);

    Optional<Organization> findByOwner(User owner);

    boolean existsBySlug(String slug);
}
