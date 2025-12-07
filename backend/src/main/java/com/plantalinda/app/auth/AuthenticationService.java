package com.plantalinda.app.auth;

import com.plantalinda.app.config.JwtService;
import com.plantalinda.app.model.Organization;
import com.plantalinda.app.model.Role;
import com.plantalinda.app.model.User;
import com.plantalinda.app.repository.OrganizationRepository;
import com.plantalinda.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final OrganizationRepository organizationRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public AuthenticationResponse register(RegisterRequest request) {
                // Check if email already exists
                if (repository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("El correo electrónico ya está registrado");
                }

                // 1. Create User first (without organization)
                var user = User.builder()
                                .firstname(request.getFirstname())
                                .lastname(request.getLastname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.OWNER) // First user is always OWNER
                                .build();

                repository.save(user);

                // 2. Create Organization with owner already set
                var organization = Organization.builder()
                                .name(request.getFirstname() + "'s Organization")
                                .slug(generateSlug(request.getFirstname(), request.getLastname()))
                                .plan(com.plantalinda.app.model.PlanType.FREE)
                                .active(true)
                                .maxUsers(1)
                                .maxBatches(5)
                                .owner(user) // Set owner immediately
                                .build();

                organizationRepository.save(organization);

                // 3. Update user with organization reference
                user.setOrganization(organization);
                repository.save(user);

                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole().name());
                extraClaims.put("organizationId", organization.getId());
                extraClaims.put("plan", organization.getPlan().name());

                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        private String generateSlug(String firstname, String lastname) {
                String base = (firstname + "-" + lastname).toLowerCase().replaceAll("[^a-z0-9]", "");
                return base + "-" + java.util.UUID.randomUUID().toString().substring(0, 8);
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                // Use findByEmailWithOrganization to load organization eagerly
                var user = repository.findByEmailWithOrganization(request.getEmail())
                                .orElseThrow();
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole().name());
                if (user.getOrganization() != null) {
                        extraClaims.put("organizationId", user.getOrganization().getId());
                        extraClaims.put("plan", user.getOrganization().getPlan().name());
                }
                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}
