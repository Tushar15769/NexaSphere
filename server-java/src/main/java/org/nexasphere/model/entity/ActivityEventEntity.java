package org.nexasphere.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activity_events")
@Data
@NoArgsConstructor
public class ActivityEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String activityKey;

    @NotBlank
    private String name;

    private String date;
    private String description;
    private String participants;
    private String result;
}
