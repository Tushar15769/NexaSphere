package org.nexasphere.model;

import java.time.Instant;

public record SessionInfo(String email, Instant createdAt, Instant expiresAt) {

    public boolean isExpired(Instant now) {
        return expiresAt.isBefore(now);
    }
}
