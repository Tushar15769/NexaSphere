INSERT INTO events (id, name, short_name, date_text, description, status, icon, created_at, updated_at)
SELECT 'kss-153',
       'KSS #153 — Knowledge Sharing Session',
       'KSS #153',
       'March 14, 2025',
       'NexaSphere''s inaugural Knowledge Sharing Session focused on the impact of AI on everyday life, industry, and careers.',
       'completed',
       '🧠',
       NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 'kss-153');

INSERT INTO event_tags (event_id, tags)
SELECT 'kss-153', tag
FROM (VALUES ('AI'), ('Learning'), ('Community')) AS t(tag)
WHERE NOT EXISTS (SELECT 1 FROM event_tags WHERE event_id = 'kss-153' AND tags = tag);
