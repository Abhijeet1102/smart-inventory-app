package com.inventory.controller;

import com.inventory.model.OrderDetails;
import com.inventory.repository.OrderDetailsRepository;
import com.inventory.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<OrderDetails> getAllOrders() {
        return orderDetailsRepository.findByUserEmail(getCurrentUserEmail());
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderDetails orderDetails) {
        try {
            orderDetails.setUserEmail(getCurrentUserEmail());
            OrderDetails savedOrder = orderService.placeOrder(orderDetails, getCurrentUserEmail());
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
