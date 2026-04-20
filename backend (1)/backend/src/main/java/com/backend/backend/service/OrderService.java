package com.backend.backend.service;

import com.backend.backend.dto.request.OrderRequest;
import com.backend.backend.dto.response.OrderResponse;
import com.backend.backend.exception.BadRequestException;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.model.*;
import com.backend.backend.model.enums.OrderStatus;
import com.backend.backend.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartItemRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public OrderResponse placeOrder(String email, OrderRequest req) {

        User user = getUser(email);
        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty. Add items before placing an order.");
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(req.getShippingAddress())
                .totalAmount(BigDecimal.ZERO)
                .build();

        Order savedOrder = orderRepo.save(order);

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for: " + product.getName()
                );
            }

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepo.save(product);

            BigDecimal subtotal =
                    product.getPrice().multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    );

            total = total.add(subtotal);

            OrderItem item = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();

            items.add(item);
        }

        savedOrder.setTotalAmount(total);
        savedOrder.setItems(items);

        orderRepo.save(savedOrder);

        cartRepo.deleteByUserId(user.getId());

        return OrderResponse.from(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String email) {

        User user = getUser(email);

        return orderRepo.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getOrderById(String email, Long orderId) {

        User user = getUser(email);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        return OrderResponse.from(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse updateStatus(Long orderId, String status) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        return OrderResponse.from(orderRepo.save(order));
    }

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}