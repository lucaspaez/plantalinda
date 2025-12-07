package com.cannabis.app.auth;

import com.cannabis.app.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class RegisterRequest {
    @NotBlank
    private String firstname;
    @NotBlank
    private String lastname;
    @Email
    @NotBlank
    private String email;
    @Size(min = 6, message = "Password must be at least 6 characters")
    @NotBlank
    private String password;
    private Role role;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthenticationRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthenticationResponse {
    private String token;
}
