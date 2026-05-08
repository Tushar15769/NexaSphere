package org.nexasphere.model.events;

import org.nexasphere.model.entity.EventEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class EventDeletedEvent extends AdminEvent {
    private final EventEntity event;

    public EventDeletedEvent(String adminEmail, EventEntity event) {
        super(UUID.randomUUID().toString(), adminEmail, LocalDateTime.now(), "EVENT_DELETED");
        this.event = event;
        setMetadata(Map.of(
                "eventId", event.getId(),
                "eventName", event.getName()
        ));
    }

    public EventEntity getEvent() { return event; }
}
