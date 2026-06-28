package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String categoryId);
    List<Product> findByUserEmail(String userEmail);
    Optional<Product> findByIdAndUserEmail(String id, String userEmail);
}
