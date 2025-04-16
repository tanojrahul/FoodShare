package com.klef.sdp.foodwasteproject.model;


import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Reviews")
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "donation_id", nullable = false)
    private UUID donationId;

    @Column(name = "reviewer_id", nullable = false)
    private UUID reviewerId;

    @Column(name = "reviewee_id", nullable = false)
    private UUID revieweeId;

    @Column(nullable = false)
    private int rating; // Expected to be between 1 and 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getDonationId() {
		return donationId;
	}

	public void setDonationId(UUID donationId) {
		this.donationId = donationId;
	}

	public UUID getReviewerId() {
		return reviewerId;
	}

	public void setReviewerId(UUID reviewerId) {
		this.reviewerId = reviewerId;
	}

	public UUID getRevieweeId() {
		return revieweeId;
	}

	public void setRevieweeId(UUID revieweeId) {
		this.revieweeId = revieweeId;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
