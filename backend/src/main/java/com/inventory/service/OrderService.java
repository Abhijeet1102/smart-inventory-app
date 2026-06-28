package com.inventory.service;

import com.inventory.model.CartItem;
import com.inventory.model.OrderDetails;
import com.inventory.model.Product;
import com.inventory.repository.OrderDetailsRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PdfService pdfService;

    @Transactional
    public OrderDetails placeOrder(OrderDetails orderDetails, String userEmail) throws Exception {
        // Generate Order ID
        String datePart = new java.text.SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime());
        String randomPart = String.format("%04d", new java.util.Random().nextInt(10000));
        String orderId = "INV-" + datePart + "-" + randomPart;
        orderDetails.setOrderId(orderId);

        // Set Date
        SimpleDateFormat myFormat = new SimpleDateFormat("dd-MM-yyyy");
        Calendar cal = Calendar.getInstance();
        orderDetails.setOrderDate(myFormat.format(cal.getTime()));

        // Deduct quantities
        if (orderDetails.getCartItems() != null) {
            for (CartItem item : orderDetails.getCartItems()) {
                Product product = productRepository.findByIdAndUserEmail(item.getProductId(), userEmail)
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
                
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        }

        // Save order
        OrderDetails savedOrder = orderDetailsRepository.save(orderDetails);

        // Generate PDF
        pdfService.generateOrderPdf(savedOrder);

        return savedOrder;
    }
}
