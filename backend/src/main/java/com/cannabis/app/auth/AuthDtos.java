package com.cannabis.app.auth;

import com.cannabis.app.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Role role;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthenticationRequest {
    private String email;
    private String password;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthenticationResponse {
    private String token;
}
