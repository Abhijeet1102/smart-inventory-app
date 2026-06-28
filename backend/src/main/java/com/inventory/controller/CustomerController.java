package com.inventory.controller;

import com.inventory.model.Customer;
import com.inventory.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findByUserEmail(getCurrentUserEmail());
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        customer.setUserEmail(getCurrentUserEmail());
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String id, @RequestBody Customer customerDetails) {
        return customerRepository.findByIdAndUserEmail(id, getCurrentUserEmail())
                .map(customer -> {
                    customer.setName(customerDetails.getName());
                    customer.setMobileNumber(customerDetails.getMobileNumber());
                    customer.setEmail(customerDetails.getEmail());
                    return ResponseEntity.ok(customerRepository.save(customer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        return customerRepository.findByIdAndUserEmail(id, getCurrentUserEmail())
                .map(customer -> {
                    customerRepository.delete(customer);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
