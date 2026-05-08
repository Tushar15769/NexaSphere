package org.nexasphere.repository;

import org.nexasphere.model.entity.ActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityEventRepository extends JpaRepository<ActivityEvent, String> {
    List<ActivityEvent> findByActivityKeyOrderByCreatedAtDesc(String activityKey);
    Optional<ActivityEvent> findByIdAndActivityKey(String id, String activityKey);
}
