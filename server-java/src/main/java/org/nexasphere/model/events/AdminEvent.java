package org.nexasphere.model.events;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public abstract class AdminEvent {
    private final String id;
    private final String adminEmail;
    private final LocalDateTime occurredAt;
    private final String type;
    private Map<String, Object> metadata = new HashMap<>();

    protected AdminEvent(String id, String adminEmail, LocalDateTime occurredAt, String type) {
        this.id = id;
        this.adminEmail = adminEmail;
        this.occurredAt = occurredAt;
        this.type = type;
    }

    public String getId() { return id; }
    public String getAdminEmail() { return adminEmail; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
    public String getType() { return type; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
