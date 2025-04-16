package com.foodshare.backend.service;


import com.foodshare.backend.dto.RegisterRequestDTO;
import com.foodshare.backend.dto.RegisterResponseDTO;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    RegisterResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) throws Exception;
}
