package com.backend.backend.controller;

import com.backend.backend.dto.request.CartRequest;
import com.backend.backend.dto.response.CartItemResponse;
import com.backend.backend.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(Authentication auth) {
        return ResponseEntity.ok(
                cartService.getCart(auth.getName())
        );
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            @Valid @RequestBody CartRequest req,
            Authentication auth) {

        return ResponseEntity.ok(
                cartService.addToCart(auth.getName(), req)
        );
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItemResponse> updateQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        auth.getName(),
                        itemId,
                        body.get("quantity")
                )
        );
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long itemId,
            Authentication auth) {

        cartService.removeFromCart(auth.getName(), itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount(Authentication auth) {
        return ResponseEntity.ok(
                Map.of("count", cartService.getCartCount(auth.getName()))
        );
    }
}