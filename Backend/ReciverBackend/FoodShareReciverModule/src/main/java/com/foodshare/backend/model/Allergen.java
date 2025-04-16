package com.foodshare.backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "allergens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Allergen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "allergens")
    private Set<FoodListing> foodListings;
}
