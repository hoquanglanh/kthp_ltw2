package com.cafe.cafe_backend.service;

import com.cafe.cafe_backend.entity.OrderEntity;
import com.cafe.cafe_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    public Map<String, Object> getDailyReport() {
        // Lấy ngày hiện tại (UTC)
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        // Lọc đơn hàng trong ngày
        List<OrderEntity> orders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay) && o.getCreatedAt().isBefore(endOfDay))
                .collect(Collectors.toList());

        // Tổng số đơn hàng
        long totalOrders = orders.size();

        // Tổng doanh thu
        double totalRevenue = orders.stream()
                .mapToDouble(OrderEntity::getTotalPrice)
                .sum();

        // Số lượng khách hàng duy nhất
        long totalCustomers = orders.stream()
                .map(OrderEntity::getUserId)
                .distinct()
                .count();

        Map<String, Object> report = new HashMap<>();
        report.put("date", today);
        report.put("totalOrders", totalOrders);
        report.put("totalRevenue", totalRevenue);
        report.put("totalCustomers", totalCustomers);

        return report;
    }
}
