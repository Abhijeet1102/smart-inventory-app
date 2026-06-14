package com.inventory.controller;

import com.inventory.model.AppUser;
import com.inventory.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AppUserRepository appUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser loginRequest) {
        Optional<AppUser> userOpt = appUserRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword()) && "Active".equals(user.getStatus())) {
                // For simplicity in this iteration, we return the user object
                // In a production app, we would return a JWT token here.
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials or inactive account");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AppUser newUser) {
        if (appUserRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered");
        }
        
        newUser.setStatus("Active");
        // Only super admins can assign user roles, but for signup, we default to "Admin"
        if (newUser.getUserRole() == null) {
            newUser.setUserRole("Admin");
        }
        
        AppUser savedUser = appUserRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }
}
