package org.nexasphere.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nexasphere.model.SessionInfo;
import org.nexasphere.model.entity.ActivityEvent;
import org.nexasphere.service.TokenService;
import org.nexasphere.service.crud.ActivityEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ActivityEventsController {
    private final ActivityEventService activityEventService;
    private final TokenService tokenService;
    
    @GetMapping("/api/content/activity-events/{activityKey}")
    public ResponseEntity<List<ActivityEvent>> getActivityEvents(
            @PathVariable String activityKey) {
        return ResponseEntity.ok(activityEventService.getEventsByActivity(activityKey));
    }
    
    @PostMapping("/api/admin/activity-events/{activityKey}")
    public ResponseEntity<ActivityEvent> createActivityEvent(
            @PathVariable String activityKey,
            @Valid @RequestBody ActivityEvent event,
            @RequestHeader("Authorization") String authHeader) {
        String adminEmail = extractEmailFromToken(authHeader);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(activityEventService.createEvent(activityKey, event, adminEmail));
    }
    
    @DeleteMapping("/api/admin/activity-events/{activityKey}/{eventId}")
    public ResponseEntity<Map<String, Boolean>> deleteActivityEvent(
            @PathVariable String activityKey,
            @PathVariable String eventId,
            @RequestHeader("Authorization") String authHeader) {
        String adminEmail = extractEmailFromToken(authHeader);
        activityEventService.deleteEvent(activityKey, eventId, adminEmail);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "system@nexasphere.org";
        }
        String token = authHeader.substring(7);
        return tokenService.validate(token)
            .map(SessionInfo::email)
            .orElse("system@nexasphere.org");
    }
}
