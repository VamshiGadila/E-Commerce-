package com.backend.backend.controller;

import com.backend.backend.dto.request.OrderRequest;
import com.backend.backend.dto.response.OrderResponse;
import com.backend.backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest req,
            Authentication auth) {

        return ResponseEntity.ok(
                orderService.placeOrder(auth.getName(), req)
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(
                orderService.getMyOrders(auth.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Long id,
            Authentication auth) {

        return ResponseEntity.ok(
                orderService.getOrderById(auth.getName(), id)
        );
    }
}