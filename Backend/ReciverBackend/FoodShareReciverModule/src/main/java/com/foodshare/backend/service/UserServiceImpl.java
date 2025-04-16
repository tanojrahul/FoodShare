package com.foodshare.backend.service;


import com.foodshare.backend.dto.RegisterRequestDTO;
import com.foodshare.backend.dto.RegisterResponseDTO;
import com.foodshare.backend.model.User;
import com.foodshare.backend.repository.UserRepository;
import com.foodshare.backend.service.UserService;
import com.foodshare.backend.util.JwtUtil; // Assuming a utility for JWT generation
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil; // Utility class for JWT generation

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public RegisterResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) throws Exception {
        // Validate email uniqueness
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new Exception("Email already registered");
        }

        // Encrypt the password
        String encodedPassword = passwordEncoder.encode(registerRequestDTO.getPassword());

        // Create a new User object
        User user = new User();
        user.setName(registerRequestDTO.getName());
        user.setEmail(registerRequestDTO.getEmail());
        user.setPasswordHash(encodedPassword);
        user.setRole(registerRequestDTO.getRole());
        user.setPhone(registerRequestDTO.getPhone());
        user.setAddress(registerRequestDTO.getAddress().toString());
        user.setStatus(registerRequestDTO.getRole().equals("admin") ? "Pending Verification" : "Active");
        user.setCreatedAt(LocalDateTime.now());
        
        // Save user to the database
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user);

        // Prepare response DTO
        RegisterResponseDTO.UserDTO userDTO = new RegisterResponseDTO.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setStatus(user.getStatus());
        userDTO.setCreatedAt(user.getCreatedAt().toString());

        RegisterResponseDTO response = new RegisterResponseDTO();
        response.setToken(token);
        response.setUser(userDTO);

        return response;
    }
}
