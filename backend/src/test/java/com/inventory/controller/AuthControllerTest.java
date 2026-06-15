package com.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventory.config.JwtUtil;
import com.inventory.model.AppUser;
import com.inventory.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disables the security filters for pure unit testing of the controller
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppUserRepository appUserRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private AppUser mockUser;

    @BeforeEach
    public void setup() {
        mockUser = AppUser.builder()
                .id("123")
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .status("Active")
                .userRole("Admin")
                .build();
    }

    @Test
    public void testSignup_Success() throws Exception {
        Mockito.when(appUserRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        Mockito.when(appUserRepository.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            user.setId("456");
            return user;
        });
        Mockito.when(jwtUtil.generateToken("new@example.com")).thenReturn("mock-jwt-token");

        AppUser newUser = new AppUser();
        newUser.setEmail("new@example.com");
        newUser.setPassword("newpass");
        newUser.setName("New User");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.user.email").value("new@example.com"))
                .andExpect(jsonPath("$.user.status").value("Active"));
    }

    @Test
    public void testSignup_DuplicateEmail() throws Exception {
        Mockito.when(appUserRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        AppUser duplicateUser = new AppUser();
        duplicateUser.setEmail("test@example.com");
        duplicateUser.setPassword("newpass");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email is already registered"));
    }

    @Test
    public void testLogin_Success() throws Exception {
        Mockito.when(appUserRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        Mockito.when(jwtUtil.generateToken("test@example.com")).thenReturn("mock-jwt-token");

        AppUser loginRequest = new AppUser();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    public void testLogin_InvalidPassword() throws Exception {
        Mockito.when(appUserRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        AppUser loginRequest = new AppUser();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials or inactive account"));
    }

    @Test
    public void testLogin_NonExistentEmail() throws Exception {
        Mockito.when(appUserRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        AppUser loginRequest = new AppUser();
        loginRequest.setEmail("nobody@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials or inactive account"));
    }

    @Test
    public void testLogin_InactiveAccount() throws Exception {
        AppUser inactiveUser = AppUser.builder()
                .email("inactive@example.com")
                .password("password123")
                .status("Inactive")
                .build();
                
        Mockito.when(appUserRepository.findByEmail("inactive@example.com")).thenReturn(Optional.of(inactiveUser));

        AppUser loginRequest = new AppUser();
        loginRequest.setEmail("inactive@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials or inactive account"));
    }
}
