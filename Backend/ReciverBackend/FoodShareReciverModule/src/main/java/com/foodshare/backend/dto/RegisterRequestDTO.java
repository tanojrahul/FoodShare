package com.foodshare.backend.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {

    private String name;
    private String email;
    private String password;
    private String role;
    private AddressDTO address;
    private String phone;

    @Data
    public static class AddressDTO {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }
}
