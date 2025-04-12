package com.klef.sdp.foodwasteproject.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class Admincontoller {
	@GetMapping("/home")
	public String Home() {
		return "HI HELLO WELCOME TO ADMIN PORTAL";
	}
	

}
