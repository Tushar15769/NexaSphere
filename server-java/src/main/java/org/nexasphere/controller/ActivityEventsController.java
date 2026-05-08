package org.nexasphere.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.nexasphere.model.entity.ActivityEventEntity;
import org.nexasphere.repository.ActivityEventRepository;
import org.nexasphere.util.Sanitizer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/activity-events")
@Slf4j
public class ActivityEventsController {

    private final ActivityEventRepository repo;

    public ActivityEventsController(ActivityEventRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{activityKey}")
    public ResponseEntity<List<ActivityEventEntity>> getByActivity(@PathVariable String activityKey) {
        log.info("Fetching events for activity: {}", activityKey);
        return ResponseEntity.ok(repo.findByActivityKey(activityKey));
    }

    @PostMapping("/{activityKey}")
    public ResponseEntity<ActivityEventEntity> create(
            @PathVariable String activityKey,
            @Valid @RequestBody ActivityEventEntity event) {
        log.info("Creating event for activity: {}", activityKey);
        event.setId(null);
        event.setActivityKey(activityKey);
        event.setName(Sanitizer.clean(event.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(event));
    }

    @DeleteMapping("/{activityKey}/{id}")
    public ResponseEntity<Void> delete(@PathVariable String activityKey, @PathVariable Long id) {
        log.info("Deleting event ID: {} from activity: {}", id, activityKey);
        var found = repo.findById(id).filter(e -> e.getActivityKey().equals(activityKey));
        if (found.isEmpty()) {
            log.warn("Event ID {} not found for activity {}", id, activityKey);
            return ResponseEntity.notFound().build();
        }
        repo.delete(found.get());
        return ResponseEntity.noContent().build();
    }
}
