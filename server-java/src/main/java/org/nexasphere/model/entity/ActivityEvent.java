package org.nexasphere.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEvent {
    @Id
    private String id;
    
    @NotBlank
    @Pattern(regexp = "hackathon|codathon|ideathon|promptathon|workshop|insight-session|open-source-day|tech-debate")
    private String activityKey;
    
    @NotBlank
    @Size(max = 120)
    private String name;
    
    @NotBlank
    @Size(max = 80)
    private String dateText;
    
    @NotBlank
    @Size(max = 240)
    private String tagline;
    
    @NotBlank
    @Size(max = 1200)
    private String description;
    
    @NotBlank
    @Pattern(regexp = "upcoming|completed")
    private String status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = "manual-" + System.currentTimeMillis();
        }
    }
}
