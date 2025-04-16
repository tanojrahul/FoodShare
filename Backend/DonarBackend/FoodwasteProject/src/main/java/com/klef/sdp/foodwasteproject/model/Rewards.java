package com.klef.sdp.foodwasteproject.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Rewards")
public class Rewards {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private int id;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(nullable = false)
    private int points;

    @Column(length = 100)
    private String reason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
