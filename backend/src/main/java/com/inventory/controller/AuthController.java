package com.inventory.controller;

import com.inventory.config.JwtUtil;
import com.inventory.model.AppUser;
import com.inventory.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser loginRequest) {
        Optional<AppUser> userOpt = appUserRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword()) && "Active".equals(user.getStatus())) {
                String token = jwtUtil.generateToken(user.getEmail());
                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                response.put("token", token);
                return ResponseEntity.ok(response);
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
        String token = jwtUtil.generateToken(savedUser.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
