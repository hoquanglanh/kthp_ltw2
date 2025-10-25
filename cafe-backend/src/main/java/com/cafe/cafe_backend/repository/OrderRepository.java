package com.cafe.cafe_backend.repository;

import com.cafe.cafe_backend.entity.OrderEntity;
import com.cafe.cafe_backend.entity.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUserId(String userId);
    List<OrderEntity> findByStatus(OrderStatus status);
}
