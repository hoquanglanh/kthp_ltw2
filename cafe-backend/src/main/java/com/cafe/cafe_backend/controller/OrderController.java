package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.entity.OrderEntity;
import com.cafe.cafe_backend.entity.OrderStatus;
import com.cafe.cafe_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<OrderEntity> create(@RequestBody Map<String, Object> req, Principal principal) {
        String userId = principal.getName();
        String tableId = (String) req.get("tableId");
        List<String> productIds = (List<String>) req.get("productIds");

        return ResponseEntity.ok(orderService.createOrder(userId, tableId, productIds));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderEntity> getAll(@RequestParam(required = false) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return orderService.getAllOrders(date);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<OrderEntity> getMyOrders(Principal principal) {
        return orderService.getOrdersByUser(principal.getName());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderEntity> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PostMapping("/add-items")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<OrderEntity> addItemsToExistingOrder(@RequestBody Map<String, Object> req, Principal principal) {
        String userId = principal.getName();
        String tableId = (String) req.get("tableId");
        List<String> productIds = (List<String>) req.get("productIds");

        return ResponseEntity.ok(orderService.addItemsToOrder(userId, tableId, productIds));
    }
}