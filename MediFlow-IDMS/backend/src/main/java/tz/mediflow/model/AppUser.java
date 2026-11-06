package tz.mediflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="app_users")
public class AppUser {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true, length=80) private String username;
    @Column(nullable=false) private String passwordHash;
    @Column(nullable=false, length=140) private String fullName;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private Role role;
    @Column(nullable=false) private boolean enabled=true;
    @Column(nullable=false, updatable=false) private Instant createdAt=Instant.now();

    protected AppUser() {}
    public AppUser(String username, String passwordHash, String fullName, Role role) {
        this.username=username; this.passwordHash=passwordHash; this.fullName=fullName; this.role=role;
    }
    public Long getId(){return id;} public String getUsername(){return username;}
    public String getPasswordHash(){return passwordHash;} public String getFullName(){return fullName;}
    public Role getRole(){return role;} public boolean isEnabled(){return enabled;}
    public void setEnabled(boolean enabled){this.enabled=enabled;}
}
