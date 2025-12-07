package com.plantalinda.app.controller;

import com.plantalinda.app.dto.UserManagementDtos.*;
import com.plantalinda.app.model.Organization;
import com.plantalinda.app.model.User;
import com.plantalinda.app.service.InvitationResult;
import com.plantalinda.app.service.OrganizationService;
import com.plantalinda.app.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller para gestión de organizaciones y equipos
 */
@RestController
@RequestMapping("/api/v1/organization")
@RequiredArgsConstructor
public class OrganizationController {

        private final OrganizationService organizationService;
        private final UserManagementService userManagementService;

        /**
         * Obtiene información de la organización actual
         */
        @GetMapping
        public ResponseEntity<Organization> getOrganization(
                        @AuthenticationPrincipal User user) {
                Organization org = organizationService.getUserOrganization(user);
                return ResponseEntity.ok(org);
        }

        /**
         * Obtiene estadísticas de la organización
         */
        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getStats(
                        @AuthenticationPrincipal User user) {
                Map<String, Object> stats = organizationService.getOrganizationStats(user);
                return ResponseEntity.ok(stats);
        }

        /**
         * Obtiene información del plan actual
         */
        @GetMapping("/plan")
        public ResponseEntity<Map<String, Object>> getPlanInfo(
                        @AuthenticationPrincipal User user) {
                Map<String, Object> planInfo = organizationService.getPlanInfo(user);
                return ResponseEntity.ok(planInfo);
        }

        /**
         * Obtiene todos los miembros del equipo
         */
        @GetMapping("/members")
        public ResponseEntity<TeamMemberListResponse> getTeamMembers(
                        @AuthenticationPrincipal User user) {

                List<User> members = userManagementService.getTeamMembers(user);
                Organization org = organizationService.getUserOrganization(user);

                List<UserResponse> memberResponses = members.stream()
                                .map(member -> UserResponse.builder()
                                                .id(member.getId())
                                                .email(member.getEmail())
                                                .firstname(member.getFirstname())
                                                .lastname(member.getLastname())
                                                .role(member.getRole())
                                                .organizationId(org.getId())
                                                .organizationName(org.getName())
                                                .build())
                                .collect(Collectors.toList());

                TeamMemberListResponse response = TeamMemberListResponse.builder()
                                .totalMembers(members.size())
                                .maxMembers(org.getMaxUsers() != null ? org.getMaxUsers() : -1)
                                .canAddMore(organizationService.canAddUser(org))
                                .members(memberResponses)
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * Invita un nuevo usuario a la organización
         */
        @PostMapping("/members/invite")
        public ResponseEntity<InvitationResponse> inviteUser(
                        @AuthenticationPrincipal User user,
                        @RequestBody InviteUserRequest request) {

                var result = userManagementService.inviteUser(
                                user,
                                request.getEmail(),
                                request.getFirstname(),
                                request.getLastname(),
                                request.getRole());

                InvitationResponse response = InvitationResponse.builder()
                                .userId(result.user().getId())
                                .email(result.user().getEmail())
                                .temporaryPassword(result.temporaryPassword())
                                .message("Usuario invitado exitosamente. Comparta la contraseña temporal con el nuevo usuario.")
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * Actualiza el rol de un usuario
         */
        @PutMapping("/members/{userId}/role")
        public ResponseEntity<UserResponse> updateUserRole(
                        @AuthenticationPrincipal User user,
                        @PathVariable Long userId,
                        @RequestBody UpdateRoleRequest request) {

                User updatedUser = userManagementService.updateUserRole(
                                user, userId, request.getNewRole());

                UserResponse response = UserResponse.builder()
                                .id(updatedUser.getId())
                                .email(updatedUser.getEmail())
                                .firstname(updatedUser.getFirstname())
                                .lastname(updatedUser.getLastname())
                                .role(updatedUser.getRole())
                                .organizationId(updatedUser.getOrganization().getId())
                                .organizationName(updatedUser.getOrganization().getName())
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * Elimina un usuario de la organización.
         * Intenta hard delete primero, si tiene datos asociados hace soft delete.
         */
        @DeleteMapping("/members/{userId}")
        public ResponseEntity<Map<String, Object>> removeUser(
                        @AuthenticationPrincipal User user,
                        @PathVariable Long userId) {

                boolean hardDeleted = userManagementService.removeUser(user, userId);

                return ResponseEntity.ok(Map.of(
                                "message", hardDeleted
                                                ? "Usuario eliminado permanentemente"
                                                : "Usuario desactivado (tiene datos asociados)",
                                "userId", userId.toString(),
                                "hardDeleted", hardDeleted,
                                "softDeleted", !hardDeleted));
        }

        /**
         * Restaura un usuario eliminado (soft delete)
         */
        @PostMapping("/members/{userId}/restore")
        public ResponseEntity<UserResponse> restoreUser(
                        @AuthenticationPrincipal User user,
                        @PathVariable Long userId) {

                User restoredUser = userManagementService.restoreUser(user, userId);

                UserResponse response = UserResponse.builder()
                                .id(restoredUser.getId())
                                .email(restoredUser.getEmail())
                                .firstname(restoredUser.getFirstname())
                                .lastname(restoredUser.getLastname())
                                .role(restoredUser.getRole())
                                .organizationId(restoredUser.getOrganization().getId())
                                .organizationName(restoredUser.getOrganization().getName())
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * Obtiene un usuario específico
         */
        @GetMapping("/members/{userId}")
        public ResponseEntity<UserResponse> getUserById(
                        @AuthenticationPrincipal User user,
                        @PathVariable Long userId) {

                User member = userManagementService.getUserById(user, userId);

                UserResponse response = UserResponse.builder()
                                .id(member.getId())
                                .email(member.getEmail())
                                .firstname(member.getFirstname())
                                .lastname(member.getLastname())
                                .role(member.getRole())
                                .organizationId(member.getOrganization().getId())
                                .organizationName(member.getOrganization().getName())
                                .build();

                return ResponseEntity.ok(response);
        }
}
