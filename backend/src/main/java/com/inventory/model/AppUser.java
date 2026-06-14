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
@Document(collection = "appuser")
public class AppUser {
    @Id
    private String id;
    private String userRole;
    private String name;
    private String mobileNumber;
    private String email;
    private String password;
    private String address;
    private String status;
}
