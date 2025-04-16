package com.klef.sdp.foodwasteproject.model;

import java.security.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "food_requests")
public class FoodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "uuid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", referencedColumnName = "id", nullable = false)
    private FoodListing food;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", referencedColumnName = "id", nullable = false)
    private User requestedBy;

    @Column(name = "status", length = 30, nullable = false)
    private String status;  // ['Pending', 'Accepted', 'Rejected']

    @Column(name = "requested_at", nullable = false)
    private Timestamp requestedAt;

    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public FoodListing getFood() {
        return food;
    }

    public void setFood(FoodListing food) {
        this.food = food;
    }

    public User getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(User requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(Timestamp requestedAt) {
        this.requestedAt = requestedAt;
    }
}
