package com.cafe.cafe_backend.service;

import com.cafe.cafe_backend.entity.Product;
import com.cafe.cafe_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product newProduct) {
        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(newProduct.getName());
                    existing.setCategory(newProduct.getCategory());
                    existing.setDescription(newProduct.getDescription());
                    existing.setPrice(newProduct.getPrice());
                    existing.setImageUrl(newProduct.getImageUrl());
                    return productRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
