package com.cannabis.app.controller;

import com.cannabis.app.dto.*;
import com.cannabis.app.model.InventoryItemType;
import com.cannabis.app.model.Role;
import com.cannabis.app.model.User;
import com.cannabis.app.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final com.cannabis.app.service.PermissionService permissionService;

    @PostMapping("/items")
    public ResponseEntity<InventoryItemResponse> createItem(
            @RequestBody CreateInventoryItemRequest request,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "create inventory item");

        if (!permissionService.canManageInventory(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!permissionService.canAccessProFeatures(user)) {
            throw new IllegalStateException("El inventario es una función PRO. Actualiza tu plan.");
        }

        InventoryItemResponse response = inventoryService.createItem(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/items")
    public ResponseEntity<List<InventoryItemResponse>> getUserInventory(
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view inventory");

        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<InventoryItemResponse> items = inventoryService.getUserInventory(user);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/type/{type}")
    public ResponseEntity<List<InventoryItemResponse>> getInventoryByType(
            @PathVariable InventoryItemType type,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view inventory");
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<InventoryItemResponse> items = inventoryService.getInventoryByType(user, type);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/low-stock")
    public ResponseEntity<List<InventoryItemResponse>> getLowStockItems(
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view inventory");
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<InventoryItemResponse> items = inventoryService.getLowStockItems(user);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/{itemId}")
    public ResponseEntity<InventoryItemResponse> getItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view inventory item");
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        InventoryItemResponse item = inventoryService.getItemById(itemId, user);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "delete inventory item");
        if (!permissionService.canManageInventory(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        inventoryService.deleteItem(itemId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/movements")
    public ResponseEntity<InventoryMovementResponse> recordMovement(
            @RequestBody CreateInventoryMovementRequest request,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "record movement");
        if (!permissionService.canManageInventory(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        InventoryMovementResponse response = inventoryService.recordMovement(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/items/{itemId}/movements")
    public ResponseEntity<List<InventoryMovementResponse>> getItemMovements(
            @PathVariable Long itemId,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view movements");
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<InventoryMovementResponse> movements = inventoryService.getItemMovements(itemId, user);
        return ResponseEntity.ok(movements);
    }

    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovementResponse>> getAllMovements(
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view movements");
        if (!permissionService.canAccessProFeatures(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<InventoryMovementResponse> movements = inventoryService.getAllMovements(user);
        return ResponseEntity.ok(movements);
    }
}
