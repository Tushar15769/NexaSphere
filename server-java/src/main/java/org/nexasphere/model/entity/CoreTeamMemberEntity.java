package org.nexasphere.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "core_team")
@Data
@NoArgsConstructor
public class CoreTeamMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String role;
    private String branch;
    private String year;
    private String email;
    private String linkedin;
    private String photo;
}
