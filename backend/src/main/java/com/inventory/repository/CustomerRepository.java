package com.inventory.repository;

import com.inventory.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    List<Customer> findByUserEmail(String userEmail);
    Optional<Customer> findByIdAndUserEmail(String id, String userEmail);
}
