package com.inventory.controller;

import com.inventory.model.AppUser;
import com.inventory.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class AppUserController {

    @Autowired
    private AppUserRepository appUserRepository;

    @GetMapping
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @PostMapping
    public AppUser createUser(@RequestBody AppUser user) {
        return appUserRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@PathVariable String id, @RequestBody AppUser userDetails) {
        return appUserRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setMobileNumber(userDetails.getMobileNumber());
                    user.setEmail(userDetails.getEmail());
                    user.setAddress(userDetails.getAddress());
                    user.setStatus(userDetails.getStatus());
                    // Update password if provided
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(userDetails.getPassword());
                    }
                    return ResponseEntity.ok(appUserRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        return appUserRepository.findById(id)
                .map(user -> {
                    appUserRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
