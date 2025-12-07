package com.cannabis.app.auth;

import com.cannabis.app.config.JwtService;
import com.cannabis.app.model.Organization;
import com.cannabis.app.model.Role;
import com.cannabis.app.model.User;
import com.cannabis.app.repository.OrganizationRepository;
import com.cannabis.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    private RegisterRequest registerRequest;
    private AuthenticationRequest authRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .firstname("Test")
                .lastname("User")
                .email("test@example.com")
                .password("password123")
                .role(Role.OPERATOR)
                .build();

        authRequest = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        testUser = User.builder()
                .id(1L)
                .firstname("Test")
                .lastname("User")
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.OPERATOR)
                .build();
    }

    @Test
    void register_ShouldCreateUserAndReturnToken() {
        // Given
        Organization testOrg = Organization.builder().id(1L).name("Test Org").build();
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrg);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("jwt-token");

        // When
        AuthenticationResponse response = authenticationService.register(registerRequest);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldEncodePassword() {
        // Given
        Organization testOrg = Organization.builder().id(1L).name("Test Org").build();
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrg);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("jwt-token");

        // When
        authenticationService.register(registerRequest);

        // Then
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnToken() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("jwt-token");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);

        // When
        AuthenticationResponse response = authenticationService.authenticate(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    void authenticate_WithInvalidCredentials_ShouldThrowException() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(authRequest);
        });
    }

    @Test
    void authenticate_WithNonExistentUser_ShouldThrowException() {
        // Given
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authenticationService.authenticate(authRequest);
        });
    }
}
