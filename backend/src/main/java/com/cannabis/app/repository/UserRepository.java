package com.cannabis.app.repository;

import com.cannabis.app.model.Organization;
import com.cannabis.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    /**
     * Carga el usuario con su organización de forma eager (JOIN FETCH).
     * Esto es necesario para evitar LazyInitializationException cuando se accede
     * a user.getOrganization().getPlan() fuera de una transacción.
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.organization WHERE u.email = :email")
    Optional<User> findByEmailWithOrganization(@Param("email") String email);

    boolean existsByEmail(String email);

    // Multi-tenancy queries
    List<User> findByOrganization(Organization organization);

    long countByOrganization(Organization organization);
}
