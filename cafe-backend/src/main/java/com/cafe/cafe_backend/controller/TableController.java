package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.entity.TableEntity;
import com.cafe.cafe_backend.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    //Xem tất cả bàn
    @GetMapping
    public List<TableEntity> getAll() {
        return tableService.getAllTables();
    }

    //Xem bàn còn trống
    @GetMapping("/available")
    public List<TableEntity> getAvailable() {
        return tableService.getAvailableTables();
    }

    //Thêm bàn
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TableEntity> create(@RequestBody TableEntity table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }

    //Cập nhật bàn
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TableEntity> update(@PathVariable String id, @RequestBody TableEntity table) {
        return ResponseEntity.ok(tableService.updateTable(id, table));
    }

    //Xóa bàn
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}