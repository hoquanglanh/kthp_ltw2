package com.cafe.cafe_backend.service;

import com.cafe.cafe_backend.entity.*;
import com.cafe.cafe_backend.repository.OrderRepository;
import com.cafe.cafe_backend.repository.ProductRepository;
import com.cafe.cafe_backend.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final ProductRepository productRepository;

    public OrderEntity createOrder(String userId, String tableId, List<String> productIds) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));

        if (table.getStatus() != TableStatus.AVAILABLE)
            throw new RuntimeException("Bàn này không còn trống!");

        List<OrderItem> items = productIds.stream()
                .map(productId -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy món: " + productId));
                    return new OrderItem(productId, product.getName(), 1, product.getPrice());
                })
                .collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        OrderEntity order = OrderEntity.builder()
                .userId(userId)
                .tableId(tableId)
                .items(items)
                .totalPrice(total)
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        orderRepository.save(order);

        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);

        return order;
    }

    public List<OrderEntity> getAllOrders(LocalDate date) {
        Instant startOfDay = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endOfDay = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null &&
                        o.getCreatedAt().isAfter(startOfDay) &&
                        o.getCreatedAt().isBefore(endOfDay))
                .collect(Collectors.toList());
    }

    public List<OrderEntity> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public OrderEntity updateStatus(String orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order"));

        order.setStatus(status);
        orderRepository.save(order);

        if (status == OrderStatus.PAID) {
            TableEntity table = tableRepository.findById(order.getTableId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));
            table.setStatus(TableStatus.PAID);
            tableRepository.save(table);
        }

        return order;
    }

    public OrderEntity addItemsToOrder(String userId, String tableId, List<String> productIds) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));

        if (table.getStatus() == TableStatus.AVAILABLE)
            throw new RuntimeException("Bàn này đang trống, hãy tạo đơn mới thay vì thêm món!");

        //Tìm order hiện tại của bàn (chưa thanh toán)
        OrderEntity existingOrder = orderRepository.findAll().stream()
                .filter(o -> o.getTableId().equals(tableId) && o.getStatus() != OrderStatus.PAID)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đang hoạt động cho bàn này!"));

        // Chặn người khác thêm món
        if (!existingOrder.getUserId().equals(userId)) {
            throw new RuntimeException("Bàn này đang được người khác sử dụng!");
        }

        // Thêm món vào order
        List<OrderItem> newItems = productIds.stream()
                .map(productId -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy món: " + productId));
                    return new OrderItem(productId, product.getName(), 1, product.getPrice());
                })
                .collect(Collectors.toList());

        existingOrder.getItems().addAll(newItems);
        existingOrder.setTotalPrice(
                existingOrder.getItems().stream()
                        .mapToDouble(i -> i.getPrice() * i.getQuantity())
                        .sum()
        );

        orderRepository.save(existingOrder);
        return existingOrder;
    }

}