package com.cafe.cafe_backend.repository;

import com.cafe.cafe_backend.entity.TableEntity;
import com.cafe.cafe_backend.entity.TableStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends MongoRepository<TableEntity, String> {
    List<TableEntity> findByStatus(TableStatus status);
}
