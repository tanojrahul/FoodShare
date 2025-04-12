package com.klef.sdp.foodwasteproject.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class receviercontroller {
	@GetMapping("/")
	public String home() {
		return "HI HELLO WELCOME TO FOOD WASTE MANAGEMENT";
	}

}
