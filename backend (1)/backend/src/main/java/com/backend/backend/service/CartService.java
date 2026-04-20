package com.backend.backend.service;

import com.backend.backend.dto.request.CartRequest;
import com.backend.backend.dto.response.CartItemResponse;
import com.backend.backend.exception.BadRequestException;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.model.CartItem;
import com.backend.backend.model.Product;
import com.backend.backend.model.User;
import com.backend.backend.repository.CartItemRepository;
import com.backend.backend.repository.ProductRepository;
import com.backend.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public List<CartItemResponse> getCart(String email) {
        User user = getUser(email);
        return cartRepo.findByUserId(user.getId())
                .stream()
                .map(CartItemResponse::from)
                .toList();
    }

    public CartItemResponse addToCart(String email, CartRequest req) {

        User user = getUser(email);

        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < req.getQuantity()) {
            throw new BadRequestException(
                    "Insufficient stock. Available: " + product.getStock()
            );
        }

        CartItem item = cartRepo.findByUserIdAndProductId(user.getId(), product.getId())
                .map(existing -> {
                    int newQty = existing.getQuantity() + req.getQuantity();

                    if (product.getStock() < newQty) {
                        throw new BadRequestException("Insufficient stock");
                    }

                    existing.setQuantity(newQty);
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(req.getQuantity())
                        .build()
                );

        return CartItemResponse.from(cartRepo.save(item));
    }

    public CartItemResponse updateQuantity(String email, Long itemId, Integer quantity) {

        User user = getUser(email);

        CartItem item = cartRepo.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        if (item.getProduct().getStock() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        item.setQuantity(quantity);
        return CartItemResponse.from(cartRepo.save(item));
    }

    public void removeFromCart(String email, Long itemId) {

        User user = getUser(email);

        CartItem item = cartRepo.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        cartRepo.delete(item);
    }

    public void clearCart(String email) {
        User user = getUser(email);
        cartRepo.deleteByUserId(user.getId());
    }

    public long getCartCount(String email) {
        User user = getUser(email);
        return cartRepo.countByUserId(user.getId());
    }

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}