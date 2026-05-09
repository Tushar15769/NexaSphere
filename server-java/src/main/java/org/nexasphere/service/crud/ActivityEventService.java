package org.nexasphere.service.crud;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nexasphere.model.entity.ActivityEvent;
import org.nexasphere.model.events.ActivityEventCreatedEvent;
import org.nexasphere.model.events.ActivityEventDeletedEvent;
import org.nexasphere.repository.ActivityEventRepository;
import org.nexasphere.service.AdminEventPublisher;
import org.nexasphere.util.Sanitizer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityEventService {
    private final ActivityEventRepository repository;
    private final AdminEventPublisher eventPublisher;
    private final Sanitizer sanitizer;
    
    private static final Set<String> VALID_ACTIVITY_KEYS = Set.of(
        "hackathon", "codathon", "ideathon", "promptathon",
        "workshop", "insight-session", "open-source-day", "tech-debate"
    );
    
    public List<ActivityEvent> getEventsByActivity(String activityKey) {
        validateActivityKey(activityKey);
        return repository.findByActivityKeyOrderByCreatedAtDesc(activityKey);
    }
    
    public ActivityEvent createEvent(String activityKey, ActivityEvent event, String adminEmail) {
        validateActivityKey(activityKey);
        event.setActivityKey(activityKey);
        sanitizeInput(event);
        
        ActivityEvent saved = repository.save(event);
        eventPublisher.publish(new ActivityEventCreatedEvent(adminEmail, saved));
        return saved;
    }
    
    public void deleteEvent(String activityKey, String eventId, String adminEmail) {
        validateActivityKey(activityKey);
        
        ActivityEvent event = repository.findByIdAndActivityKey(eventId, activityKey)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        
        repository.delete(event);
        eventPublisher.publish(new ActivityEventDeletedEvent(adminEmail, event));
    }
    
    private void validateActivityKey(String activityKey) {
        if (!VALID_ACTIVITY_KEYS.contains(activityKey)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid activity key");
        }
    }
    
    private void sanitizeInput(ActivityEvent event) {
        event.setName(sanitizer.sanitizeHtml(event.getName()));
        event.setTagline(sanitizer.sanitizeHtml(event.getTagline()));
        event.setDescription(sanitizer.sanitizeHtml(event.getDescription()));
    }
}
