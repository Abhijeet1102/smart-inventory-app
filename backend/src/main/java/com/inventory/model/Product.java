package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "product")
public class Product {
    @Id
    private String id;
    private String name;
    private Integer quantity;
    private Integer price;
    private String description;
    private String categoryId;
    private String imageBase64;
    private String userEmail;
}
