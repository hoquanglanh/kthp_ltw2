package com.cafe.cafe_backend.service;

import com.cafe.cafe_backend.entity.TableEntity;
import com.cafe.cafe_backend.entity.TableStatus;
import com.cafe.cafe_backend.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;

    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    public TableEntity createTable(TableEntity table) {
        table.setStatus(TableStatus.AVAILABLE);
        return tableRepository.save(table);
    }

    public TableEntity updateTable(String id, TableEntity updated) {
        return tableRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setCapacity(updated.getCapacity());
                    existing.setStatus(updated.getStatus());
                    return tableRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));
    }

    public void deleteTable(String id) {
        tableRepository.deleteById(id);
    }

    public List<TableEntity> getAvailableTables() {
        return tableRepository.findByStatus(TableStatus.AVAILABLE);
    }
}
