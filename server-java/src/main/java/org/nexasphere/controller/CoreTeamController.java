package org.nexasphere.controller;

import jakarta.validation.Valid;
import org.nexasphere.model.entity.CoreTeamMemberEntity;
import org.nexasphere.repository.CoreTeamRepository;
import org.nexasphere.util.Sanitizer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/core-team")
public class CoreTeamController {

    private final CoreTeamRepository repo;

    public CoreTeamController(CoreTeamRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<CoreTeamMemberEntity> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<CoreTeamMemberEntity> add(@Valid @RequestBody CoreTeamMemberEntity member) {
        member.setId(null);
        member.setName(Sanitizer.clean(member.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
