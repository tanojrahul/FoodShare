package com.klef.sdp.foodwasteproject.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Deliveries")

public class Deliveries {

    @Id
    @GeneratedValue
    private int id;

    @Column(name = "donation_id", nullable = false)
    private int donationId;

    @Column(name = "delivery_agent", length = 100)
    private String deliveryAgent;

    @Column(length = 30)
    private String status; // ['Scheduled', 'Out for Delivery', 'Delivered']

    @Column(name = "current_lat")
    private Double currentLat;

    @Column(name = "current_long")
    private Double currentLong;

    private LocalDateTime eta;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getDonationId() {
		return donationId;
	}

	public void setDonationId(int donationId) {
		this.donationId = donationId;
	}

	public String getDeliveryAgent() {
		return deliveryAgent;
	}

	public void setDeliveryAgent(String deliveryAgent) {
		this.deliveryAgent = deliveryAgent;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Double getCurrentLat() {
		return currentLat;
	}

	public void setCurrentLat(Double currentLat) {
		this.currentLat = currentLat;
	}

	public Double getCurrentLong() {
		return currentLong;
	}

	public void setCurrentLong(Double currentLong) {
		this.currentLong = currentLong;
	}

	public LocalDateTime getEta() {
		return eta;
	}

	public void setEta(LocalDateTime eta) {
		this.eta = eta;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}
