package com.inventory.controller;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByUserEmail(getCurrentUserEmail());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        product.setUserEmail(getCurrentUserEmail());
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product productDetails) {
        return productRepository.findByIdAndUserEmail(id, getCurrentUserEmail())
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setQuantity(productDetails.getQuantity());
                    product.setPrice(productDetails.getPrice());
                    product.setDescription(productDetails.getDescription());
                    product.setCategoryId(productDetails.getCategoryId());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        return productRepository.findByIdAndUserEmail(id, getCurrentUserEmail())
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
