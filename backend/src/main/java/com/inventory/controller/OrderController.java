package com.inventory.controller;

import com.inventory.model.OrderDetails;
import com.inventory.repository.OrderDetailsRepository;
import com.inventory.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<OrderDetails> getAllOrders() {
        return orderDetailsRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderDetails orderDetails) {
        try {
            OrderDetails savedOrder = orderService.placeOrder(orderDetails);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
