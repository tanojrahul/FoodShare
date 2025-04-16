package com.foodshare.backend.dto;


import lombok.Data;

@Data
public class RegisterResponseDTO {

    private String token;
    private UserDTO user;

    @Data
    public static class UserDTO {
        private String id;
        private String name;
        private String email;
        private String role;
        private String status;
        private String createdAt;
    }
}
