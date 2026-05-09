package org.nexasphere.model.events;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.nexasphere.model.entity.ActivityEvent;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ActivityEventDeletedEvent extends AdminEvent {
    private ActivityEvent event;
    
    public ActivityEventDeletedEvent(String adminEmail, ActivityEvent event) {
        super(UUID.randomUUID().toString(), adminEmail, LocalDateTime.now(), "ACTIVITY_EVENT_DELETED");
        this.event = event;
        this.setMetadata(Map.of(
            "eventId", event.getId(),
            "activityKey", event.getActivityKey(),
            "eventName", event.getName()
        ));
    }
}
