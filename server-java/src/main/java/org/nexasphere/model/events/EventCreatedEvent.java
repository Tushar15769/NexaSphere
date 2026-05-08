package org.nexasphere.model.events;

import org.nexasphere.model.entity.EventEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class EventCreatedEvent extends AdminEvent {
    private final EventEntity event;

    public EventCreatedEvent(String adminEmail, EventEntity event) {
        super(UUID.randomUUID().toString(), adminEmail, LocalDateTime.now(), "EVENT_CREATED");
        this.event = event;
        setMetadata(Map.of(
                "eventId", event.getId(),
                "eventName", event.getName(),
                "status", event.getStatus()
        ));
    }

    public EventEntity getEvent() { return event; }
}
