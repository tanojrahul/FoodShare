package com.klef.sdp.foodwasteproject.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class NGO {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;

	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "organization", nullable = false, length = 150)
	private String organization;

	@Column(name = "license_number", length = 50)
	private String licenseNumber;

	@Column(name = "verified", nullable = false)
	private boolean verified = false;

}
