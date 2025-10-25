package com.cafe.cafe_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class OrderEntity {
    @Id
    private String id;

    private String tableId;             // ID bàn được đặt
    private String userId;              // ID người đặt
    private List<OrderItem> items;
    private double totalPrice;          // tổng tiền
    private OrderStatus status;         // trạng thái
    private Instant createdAt;
    private Instant updatedAt;
}

