package org.nexasphere.model.events;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.nexasphere.model.entity.ActivityEvent;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ActivityEventCreatedEvent extends AdminEvent {
    private ActivityEvent event;
    
    public ActivityEventCreatedEvent(String adminEmail, ActivityEvent event) {
        super(UUID.randomUUID().toString(), adminEmail, LocalDateTime.now(), "ACTIVITY_EVENT_CREATED");
        this.event = event;
        this.setMetadata(Map.of(
            "eventId", event.getId(),
            "activityKey", event.getActivityKey(),
            "eventName", event.getName(),
            "status", event.getStatus()
        ));
    }
}
