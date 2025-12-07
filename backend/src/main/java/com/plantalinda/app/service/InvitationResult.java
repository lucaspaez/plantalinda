package com.plantalinda.app.service;

import com.plantalinda.app.model.User;

/**
 * Resultado de una invitación que incluye el usuario y la contraseña temporal
 */
public record InvitationResult(User user, String temporaryPassword) {
}
