package com.cannabis.app.security;

import com.cannabis.app.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que establece el contexto de tenant (organización) para cada petición.
 * 
 * Este filtro:
 * 1. Extrae el usuario autenticado del SecurityContext
 * 2. Obtiene su organización
 * 3. Establece el TenantContext para toda la petición
 * 4. Limpia el contexto al finalizar (crítico para seguridad)
 * 
 * SEGURIDAD: Este filtro garantiza que cada petición solo pueda acceder
 * a datos de la organización del usuario autenticado.
 */
@Slf4j
@Component
@Order(2) // Ejecutar después del filtro de autenticación JWT
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // Obtener usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()
                    && authentication.getPrincipal() instanceof User) {

                User user = (User) authentication.getPrincipal();

                if (user.getOrganization() != null) {
                    Long organizationId = user.getOrganization().getId();
                    TenantContext.setTenantId(organizationId);

                    log.debug("Tenant context set for user: {} (org: {})",
                            user.getEmail(), organizationId);
                } else {
                    log.warn("User {} has no organization assigned", user.getEmail());
                }
            }

            // Continuar con la cadena de filtros
            filterChain.doFilter(request, response);

        } finally {
            // CRÍTICO: Siempre limpiar el contexto al finalizar
            // Esto previene fugas de datos entre requests
            TenantContext.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // No filtrar rutas públicas
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/auth/") ||
                path.startsWith("/api/v1/public/") ||
                path.equals("/error");
    }
}
