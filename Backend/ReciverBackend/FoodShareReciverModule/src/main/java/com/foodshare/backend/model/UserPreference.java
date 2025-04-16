package com.foodshare.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "notification_email")
    private Boolean notificationEmail = true;

    @Column(name = "notification_app")
    private Boolean notificationApp = true;

    @Column(name = "preferred_radius")
    private Integer preferredRadius = 10; // in km/miles as per frontend config

    @Lob
    @Column(name = "preferred_categories")
    private String preferredCategories;

    @Column(name = "dark_mode")
    private Boolean darkMode = false;
}
