package com.foodshare.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.mapping.Set;


@Entity
@Table(name = "food_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "food_type", length = 50)
    private String foodType;

    @Column(name = "dietary_restrictions", length = 255)
    private String dietaryRestrictions;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "is_claimed")
    private Boolean isClaimed = false;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @ManyToMany
    @JoinTable(
        name = "food_categories",
        joinColumns = @JoinColumn(name = "food_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private java.util.Set<Category> categories;
    
    @ManyToMany
    @JoinTable(
        name = "food_allergens",
        joinColumns = @JoinColumn(name = "food_id"),
        inverseJoinColumns = @JoinColumn(name = "allergen_id")
    )
    private java.util.Set<Allergen> allergens;


}


