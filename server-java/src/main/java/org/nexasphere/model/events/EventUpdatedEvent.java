package org.nexasphere.model.events;

import org.nexasphere.model.entity.EventEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class EventUpdatedEvent extends AdminEvent {
    private final String eventId;
    private final EventEntity oldEvent;
    private final EventEntity newEvent;

    public EventUpdatedEvent(String adminEmail, EventEntity oldEvent, EventEntity newEvent) {
        super(UUID.randomUUID().toString(), adminEmail, LocalDateTime.now(), "EVENT_UPDATED");
        this.eventId = newEvent.getId();
        this.oldEvent = oldEvent;
        this.newEvent = newEvent;
        setMetadata(Map.of(
                "eventId", newEvent.getId(),
                "changes", detectChanges(oldEvent, newEvent)
        ));
    }

    private List<String> detectChanges(EventEntity o, EventEntity n) {
        List<String> changes = new ArrayList<>();
        if (!Objects.equals(o.getName(), n.getName())) changes.add("name");
        if (!Objects.equals(o.getShortName(), n.getShortName())) changes.add("shortName");
        if (!Objects.equals(o.getDateText(), n.getDateText())) changes.add("dateText");
        if (!Objects.equals(o.getDescription(), n.getDescription())) changes.add("description");
        if (!Objects.equals(o.getStatus(), n.getStatus())) changes.add("status");
        if (!Objects.equals(o.getIcon(), n.getIcon())) changes.add("icon");
        if (!Objects.equals(o.getTags(), n.getTags())) changes.add("tags");
        return changes;
    }

    public String getEventId() { return eventId; }
    public EventEntity getOldEvent() { return oldEvent; }
    public EventEntity getNewEvent() { return newEvent; }
}
