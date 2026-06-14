package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    private String productId;
    private String name;
    private Integer quantity;
    private Integer price;
    private String description;
    private Integer subTotal;
}
