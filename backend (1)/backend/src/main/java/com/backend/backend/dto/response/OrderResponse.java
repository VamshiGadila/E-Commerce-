package com.backend.backend.dto.response;

import com.backend.backend.model.Order;
import com.backend.backend.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;

        public static OrderItemResponse from(OrderItem oi) {
            return OrderItemResponse.builder()
                    .id(oi.getId())
                    .productName(oi.getProductName())
                    .price(oi.getPrice())
                    .quantity(oi.getQuantity())
                    .subtotal(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                    .build();
        }
    }

    public static OrderResponse from(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus().name())
                .shippingAddress(o.getShippingAddress())
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(OrderItemResponse::from).toList())
                .build();
    }
}