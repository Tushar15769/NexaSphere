package org.nexasphere.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.nexasphere.model.entity.CoreTeamMemberEntity;
import org.nexasphere.repository.CoreTeamRepository;
import org.nexasphere.util.Sanitizer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/core-team")
@Slf4j
public class CoreTeamController {

    private final CoreTeamRepository repo;
    private final Sanitizer sanitizer;

    public CoreTeamController(CoreTeamRepository repo, Sanitizer sanitizer) {
        this.repo = repo;
        this.sanitizer = sanitizer;
    }

    @GetMapping
    public ResponseEntity<List<CoreTeamMemberEntity>> getAll() {
        log.info("Fetching all core team members");
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<CoreTeamMemberEntity> add(@Valid @RequestBody CoreTeamMemberEntity member) {
        log.info("Adding new core team member: {}", member.getName());
        member.setId(null);
        member.setName(sanitizer.clean(member.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        log.info("Removing core team member ID: {}", id);
        if (!repo.existsById(id)) {
            log.warn("Member ID {} not found for removal", id);
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
