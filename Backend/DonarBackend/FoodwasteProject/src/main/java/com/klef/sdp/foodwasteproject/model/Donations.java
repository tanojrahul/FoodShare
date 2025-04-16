package com.klef.sdp.foodwasteproject.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Donations")
public class Donations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "food_id", nullable = false)
    private int foodId;

    @Column(name = "donor_id", nullable = false)
    private int donorId;

    @Column(name = "recipient_id")
    private int recipientId;

    @Column(name = "accepted_by")
    private int acceptedBy;

    @Column(length = 30)
    private String status; // Should ideally be an enum

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getFoodId() {
		return foodId;
	}

	public void setFoodId(int foodId) {
		this.foodId = foodId;
	}

	public int getDonorId() {
		return donorId;
	}

	public void setDonorId(int donorId) {
		this.donorId = donorId;
	}

	public int getRecipientId() {
		return recipientId;
	}

	public void setRecipientId(int recipientId) {
		this.recipientId = recipientId;
	}

	public int getAcceptedBy() {
		return acceptedBy;
	}

	public void setAcceptedBy(int acceptedBy) {
		this.acceptedBy = acceptedBy;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getDeliveredAt() {
		return deliveredAt;
	}

	public void setDeliveredAt(LocalDateTime deliveredAt) {
		this.deliveredAt = deliveredAt;
	}
}

