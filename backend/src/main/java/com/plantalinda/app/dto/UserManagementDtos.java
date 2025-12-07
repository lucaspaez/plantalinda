package com.plantalinda.app.dto;

import com.plantalinda.app.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTOs para gestión de usuarios y organizaciones
 */
public class UserManagementDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InviteUserRequest {
        private String email;
        private String firstname;
        private String lastname;
        private Role role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRoleRequest {
        private Role newRole;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String email;
        private String firstname;
        private String lastname;
        private Role role;
        private Long organizationId;
        private String organizationName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvitationResponse {
        private Long userId;
        private String email;
        private String temporaryPassword; // Solo para desarrollo, en producción se envía por email
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamMemberListResponse {
        private int totalMembers;
        private int maxMembers;
        private boolean canAddMore;
        private java.util.List<UserResponse> members;
    }
}
