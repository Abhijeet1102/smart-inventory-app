package com.inventory.repository;

import com.inventory.model.OrderDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails, String> {
    List<OrderDetails> findByCustomerId(String customerId);
}
