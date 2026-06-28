package com.inventory.repository;

import com.inventory.model.OrderDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails, String> {
    List<OrderDetails> findByCustomerId(String customerId);
    List<OrderDetails> findByUserEmail(String userEmail);
    Optional<OrderDetails> findByIdAndUserEmail(String id, String userEmail);
}
