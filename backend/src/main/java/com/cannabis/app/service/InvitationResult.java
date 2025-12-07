package com.cannabis.app.service;

import com.cannabis.app.model.User;

/**
 * Resultado de una invitación que incluye el usuario y la contraseña temporal
 */
public record InvitationResult(User user, String temporaryPassword) {
}
