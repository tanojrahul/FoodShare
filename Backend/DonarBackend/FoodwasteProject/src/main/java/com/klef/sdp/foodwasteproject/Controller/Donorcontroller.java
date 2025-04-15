package com.klef.sdp.foodwasteproject.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.sdp.foodwasteproject.model.Donor;
import com.klef.sdp.foodwasteproject.service.DonorService;

@RestController
@RequestMapping("/donor")
@CrossOrigin("*")
public class Donorcontroller {

    @Autowired
    private DonorService donorService;

    @GetMapping("/home")
    public String home() {
        return "HI HELLO WELCOME TO DONOR PORTAL";
    }

    @PostMapping("/registration")
    public ResponseEntity<String> donorRegistration(@RequestBody Donor donor) {
        try {
            String output = donorService.donorregistration(donor);
            return ResponseEntity.ok(output); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Donor Registration failed");
        }
    }
    @PostMapping("/checklogin")
    public ResponseEntity<?> checkdonorlogin(@RequestBody Donor donor){
    	try {
    		Donor d = donorService.checkdonorlogin(donor.getUsername(),donor.getPassword());
    		if (d!=null) 
            {
                return ResponseEntity.ok(d); // if login is successful
            } 
            else 
            {
                return ResponseEntity.status(401).body("Invalid Username or Password"); // if login is fail
            }
    		
    	}
    	catch (Exception e) {
    		return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
		}
    }
}
