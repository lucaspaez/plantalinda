package com.plantalinda.app.service;

import com.plantalinda.app.model.Organization;
import com.plantalinda.app.model.PlanType;
import com.plantalinda.app.model.User;
import com.plantalinda.app.repository.OrganizationRepository;
import com.plantalinda.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio para gestionar organizaciones (tenants).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PermissionService permissionService;

    /**
     * Obtiene la organización del usuario actual
     */
    public Organization getUserOrganization(User user) {
        if (user.getOrganization() == null) {
            throw new IllegalStateException("Usuario no pertenece a ninguna organización");
        }
        return user.getOrganization();
    }

    /**
     * Obtiene estadísticas de la organización
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationStats(User user) {
        permissionService.requirePermission(user, "view organization stats");

        Organization org = getUserOrganization(user);

        Map<String, Object> stats = new HashMap<>();
        stats.put("organizationId", org.getId());
        stats.put("organizationName", org.getName());
        stats.put("plan", org.getPlan());
        stats.put("active", org.getActive());

        // Contar usuarios
        long userCount = userRepository.countByOrganization(org);
        stats.put("userCount", userCount);
        stats.put("maxUsers", org.getMaxUsers());
        stats.put("canAddUsers", org.getMaxUsers() == null || userCount < org.getMaxUsers());

        // Límites según el plan
        stats.put("maxBatches", org.getMaxBatches());

        log.info("Stats retrieved for organization: {}", org.getName());
        return stats;
    }

    /**
     * Actualiza la configuración de la organización
     */
    @Transactional
    public Organization updateOrganizationSettings(User user, String settings) {
        permissionService.requireRole(user,
                com.plantalinda.app.model.Role.OWNER,
                com.plantalinda.app.model.Role.ADMIN);

        Organization org = getUserOrganization(user);
        org.setSettings(settings);

        Organization updated = organizationRepository.save(org);
        log.info("Organization settings updated: {}", org.getName());

        return updated;
    }

    /**
     * Actualiza el nombre de la organización
     */
    @Transactional
    public Organization updateOrganizationName(User user, String newName) {
        permissionService.requireRole(user, com.plantalinda.app.model.Role.OWNER);

        Organization org = getUserOrganization(user);
        org.setName(newName);

        Organization updated = organizationRepository.save(org);
        log.info("Organization name updated: {} -> {}", org.getName(), newName);

        return updated;
    }

    /**
     * Actualiza el plan de la organización
     */
    @Transactional
    public Organization upgradePlan(User user, PlanType newPlan) {
        permissionService.requireRole(user, com.plantalinda.app.model.Role.OWNER);

        Organization org = getUserOrganization(user);
        PlanType oldPlan = org.getPlan();

        org.setPlan(newPlan);

        // Actualizar límites según el plan
        switch (newPlan) {
            case FREE:
                org.setMaxUsers(1);
                org.setMaxBatches(5);
                break;
            case PRO:
                org.setMaxUsers(10);
                org.setMaxBatches(null); // Sin límite
                break;
            case ENTERPRISE:
                org.setMaxUsers(null); // Sin límite
                org.setMaxBatches(null); // Sin límite
                break;
        }

        Organization updated = organizationRepository.save(org);
        log.info("Organization plan upgraded: {} -> {} for {}",
                oldPlan, newPlan, org.getName());

        return updated;
    }

    /**
     * Verifica si la organización puede agregar más usuarios
     */
    public boolean canAddUser(Organization org) {
        if (org.getMaxUsers() == null) {
            return true; // Sin límite
        }

        long currentUsers = userRepository.countByOrganization(org);
        return currentUsers < org.getMaxUsers();
    }

    /**
     * Verifica si la organización puede agregar más batches
     */
    public boolean canAddBatch(Organization org) {
        return org.getMaxBatches() == null; // Por ahora simple, se puede mejorar
    }

    /**
     * Obtiene información del plan actual
     */
    public Map<String, Object> getPlanInfo(User user) {
        Organization org = getUserOrganization(user);

        Map<String, Object> planInfo = new HashMap<>();
        planInfo.put("currentPlan", org.getPlan());
        planInfo.put("maxUsers", org.getMaxUsers());
        planInfo.put("maxBatches", org.getMaxBatches());
        planInfo.put("canUpgrade", org.getPlan() != PlanType.ENTERPRISE);

        return planInfo;
    }
}
