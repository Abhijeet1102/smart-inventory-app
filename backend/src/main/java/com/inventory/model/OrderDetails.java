package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "orderDetails")
public class OrderDetails {
    @Id
    private String id;
    private String orderId;
    private String customerId;
    private String orderDate;
    private Integer totalPaid;
    private String paymentMethod;
    private List<CartItem> cartItems;
    private String userEmail;
}
