package com.cannabis.app.auth;

import com.cannabis.app.config.JwtService;
import com.cannabis.app.model.Role;
import com.cannabis.app.model.User;
import com.cannabis.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                .firstname(request.getFirstname())
                                .lastname(request.getLastname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.NOVICE)
                                .build();
                repository.save(user);
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole().name());
                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole().name());
                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}
