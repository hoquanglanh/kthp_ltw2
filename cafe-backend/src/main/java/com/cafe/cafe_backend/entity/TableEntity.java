package com.cafe.cafe_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tables")
public class TableEntity {
    @Id
    private String id;

    private String name;
    private int capacity;
    private TableStatus status;   // AVAILABLE, OCCUPIED, PAID
}
