package com.plantalinda.app.service;

import com.plantalinda.app.model.Organization;
import com.plantalinda.app.model.Role;
import com.plantalinda.app.model.User;
import com.plantalinda.app.repository.OrganizationRepository;
import com.plantalinda.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Servicio para gestionar usuarios dentro de una organización.
 * Permite invitar colaboradores, asignar roles, etc.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PermissionService permissionService;
    private final OrganizationService organizationService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtiene todos los miembros ACTIVOS de la organización del usuario
     */
    @Transactional(readOnly = true)
    public List<User> getTeamMembers(User currentUser) {
        permissionService.requirePermission(currentUser, "view team members");

        Organization org = organizationService.getUserOrganization(currentUser);
        List<User> members = userRepository.findByOrganization(org).stream()
                .filter(u -> !u.isDeleted())
                .toList();

        log.info("Retrieved {} active team members for organization: {}",
                members.size(), org.getName());

        return members;
    }

    /**
     * Obtiene los miembros ELIMINADOS (soft delete) de la organización
     */
    @Transactional(readOnly = true)
    public List<User> getDeletedMembers(User currentUser) {
        if (!permissionService.canRemoveUsers(currentUser)) {
            throw new SecurityException("No tienes permiso para ver usuarios eliminados");
        }

        Organization org = organizationService.getUserOrganization(currentUser);
        List<User> deletedMembers = userRepository.findByOrganization(org).stream()
                .filter(User::isDeleted)
                .toList();

        log.info("Retrieved {} deleted team members for organization: {}",
                deletedMembers.size(), org.getName());

        return deletedMembers;
    }

    /**
     * Invita un nuevo usuario a la organización
     * Por ahora crea el usuario directamente, en Fase 4 se implementará
     * el sistema de invitaciones por email
     */
    @Transactional
    public InvitationResult inviteUser(User inviter, String email, String firstName,
            String lastName, Role role) {
        // Verificar permisos
        if (!permissionService.canInviteUsers(inviter)) {
            throw new SecurityException("No tienes permiso para invitar usuarios");
        }

        // Verificar que puede asignar ese rol
        if (!permissionService.canAssignRole(inviter, role)) {
            throw new SecurityException("No puedes asignar el rol: " + role);
        }

        Organization org = organizationService.getUserOrganization(inviter);

        // Verificar límite de usuarios
        if (!organizationService.canAddUser(org)) {
            throw new IllegalStateException(
                    "Has alcanzado el límite de usuarios de tu plan. " +
                            "Actualiza tu plan para agregar más usuarios.");
        }

        // Verificar que el email no esté en uso
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear usuario con contraseña temporal
        String temporaryPassword = generateTemporaryPassword();

        User newUser = User.builder()
                .email(email)
                .firstname(firstName)
                .lastname(lastName)
                .password(passwordEncoder.encode(temporaryPassword))
                .role(role)
                .organization(org)
                .build();

        User savedUser = userRepository.save(newUser);

        log.info("User invited: {} with role {} to organization: {}",
                email, role, org.getName());

        // Devolver usuario y contraseña temporal
        return new InvitationResult(savedUser, temporaryPassword);
    }

    /**
     * Cambia el rol de un usuario
     */
    @Transactional
    public User updateUserRole(User admin, Long userId, Role newRole) {
        // Verificar permisos
        if (!permissionService.canAssignRoles(admin)) {
            throw new SecurityException("No tienes permiso para asignar roles");
        }

        if (!permissionService.canAssignRole(admin, newRole)) {
            throw new SecurityException("No puedes asignar el rol: " + newRole);
        }

        // Obtener usuario a modificar
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar que pertenece a la misma organización
        Organization adminOrg = organizationService.getUserOrganization(admin);
        if (!userToUpdate.getOrganization().getId().equals(adminOrg.getId())) {
            throw new SecurityException("No puedes modificar usuarios de otra organización");
        }

        // No permitir cambiar el rol del owner
        if (userToUpdate.getRole() == Role.OWNER) {
            throw new IllegalStateException("No se puede cambiar el rol del propietario");
        }

        Role oldRole = userToUpdate.getRole();
        userToUpdate.setRole(newRole);

        User updated = userRepository.save(userToUpdate);

        log.info("User role updated: {} from {} to {} by {}",
                userToUpdate.getEmail(), oldRole, newRole, admin.getEmail());

        return updated;
    }

    /**
     * Elimina un usuario de la organización.
     * Intenta hard delete primero, si falla por FK constraints hace soft delete.
     * 
     * @return true si fue hard delete, false si fue soft delete
     */
    @Transactional
    public boolean removeUser(User admin, Long userId) {
        // Verificar permisos
        if (!permissionService.canRemoveUsers(admin)) {
            throw new SecurityException("No tienes permiso para eliminar usuarios");
        }

        // Obtener usuario a eliminar
        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar que pertenece a la misma organización
        Organization adminOrg = organizationService.getUserOrganization(admin);
        if (!userToRemove.getOrganization().getId().equals(adminOrg.getId())) {
            throw new SecurityException("No puedes eliminar usuarios de otra organización");
        }

        // No permitir eliminar al owner
        if (userToRemove.getRole() == Role.OWNER) {
            throw new IllegalStateException("No se puede eliminar al propietario");
        }

        // No permitirse eliminar a sí mismo
        if (userToRemove.getId().equals(admin.getId())) {
            throw new IllegalStateException("No puedes eliminarte a ti mismo");
        }

        // Ya está eliminado?
        if (userToRemove.isDeleted()) {
            throw new IllegalStateException("El usuario ya está eliminado");
        }

        // Siempre hacer soft delete para mantener trazabilidad
        // El usuario queda desactivado pero sus datos históricos se mantienen
        userToRemove.setActive(false);
        userToRemove.setDeletedAt(java.time.LocalDateTime.now());
        userToRemove.setDeletedBy(admin.getId());
        userRepository.save(userToRemove);

        log.warn("User SOFT deleted: {} from organization: {} by {}",
                userToRemove.getEmail(), adminOrg.getName(), admin.getEmail());
        return false; // Indica soft delete
    }

    /**
     * Restaura un usuario eliminado (soft delete)
     */
    @Transactional
    public User restoreUser(User admin, Long userId) {
        // Verificar permisos (solo Owner y Admin pueden restaurar)
        if (!permissionService.canRemoveUsers(admin)) {
            throw new SecurityException("No tienes permiso para restaurar usuarios");
        }

        User userToRestore = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar que pertenece a la misma organización
        Organization adminOrg = organizationService.getUserOrganization(admin);
        if (!userToRestore.getOrganization().getId().equals(adminOrg.getId())) {
            throw new SecurityException("No puedes restaurar usuarios de otra organización");
        }

        if (!userToRestore.isDeleted()) {
            throw new IllegalStateException("El usuario no está eliminado");
        }

        userToRestore.setActive(true);
        userToRestore.setDeletedAt(null);
        userToRestore.setDeletedBy(null);

        User restored = userRepository.save(userToRestore);

        log.info("User restored: {} in organization: {} by {}",
                restored.getEmail(), adminOrg.getName(), admin.getEmail());

        return restored;
    }

    /**
     * Obtiene un usuario por ID (solo si pertenece a la misma organización)
     */
    @Transactional(readOnly = true)
    public User getUserById(User currentUser, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar que pertenece a la misma organización
        Organization currentOrg = organizationService.getUserOrganization(currentUser);
        if (!user.getOrganization().getId().equals(currentOrg.getId())) {
            throw new SecurityException("No puedes acceder a usuarios de otra organización");
        }

        return user;
    }

    /**
     * Genera una contraseña temporal para nuevos usuarios
     */
    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 12);
    }

    /**
     * Cuenta los usuarios de la organización
     */
    public long countTeamMembers(User user) {
        Organization org = organizationService.getUserOrganization(user);
        return userRepository.countByOrganization(org);
    }
}
