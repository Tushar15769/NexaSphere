package org.nexasphere.controller;

import jakarta.validation.Valid;
import org.nexasphere.model.entity.EventEntity;
import org.nexasphere.service.crud.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class EventsController {

    private final EventService eventService;

    public EventsController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/api/content/events")
    public ResponseEntity<List<EventEntity>> getPublicEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/api/admin/events")
    public ResponseEntity<List<EventEntity>> getAdminEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping("/api/admin/events")
    public ResponseEntity<EventEntity> createEvent(
            @Valid @RequestBody EventEntity event,
            @AuthenticationPrincipal String adminEmail) {
        return ResponseEntity.ok(eventService.createEvent(event, adminEmail));
    }

    @PutMapping("/api/admin/events/{id}")
    public ResponseEntity<EventEntity> updateEvent(
            @PathVariable String id,
            @Valid @RequestBody EventEntity event,
            @AuthenticationPrincipal String adminEmail) {
        return ResponseEntity.ok(eventService.updateEvent(id, event, adminEmail));
    }

    @DeleteMapping("/api/admin/events/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEvent(
            @PathVariable String id,
            @AuthenticationPrincipal String adminEmail) {
        eventService.deleteEvent(id, adminEmail);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
