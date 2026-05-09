package org.nexasphere.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nexasphere.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EventsControllerIT {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired EventRepository eventRepository;

    private String token;

    @BeforeEach
    void login() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"nexasphere@glbajajgroup.org\",\"password\":\"Admin@123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        token = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private String authHeader() { return "Bearer " + token; }

    private String eventPayload(String name) {
        return """
                {
                  "name": "%s",
                  "shortName": "KSS #154",
                  "dateText": "April 20, 2025",
                  "description": "Deep dive into advanced AI concepts and real-world applications.",
                  "status": "upcoming",
                  "icon": "🤖",
                  "tags": ["AI", "Machine Learning", "Innovation"]
                }
                """.formatted(name);
    }

    @Test
    void publicEndpoint_noAuthRequired() throws Exception {
        mockMvc.perform(get("/api/content/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void adminGetEvents_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/admin/events"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createEvent_autoGeneratesSlug() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventPayload("KSS #154 — Advanced AI Topics")))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.get("id").asText()).isEqualTo("kss-154-advanced-ai-topics");

        eventRepository.deleteById("kss-154-advanced-ai-topics");
    }

    @Test
    void createEvent_duplicateName_appendsTimestamp() throws Exception {
        String payload = eventPayload("Duplicate Event");

        MvcResult r1 = mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk()).andReturn();

        MvcResult r2 = mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk()).andReturn();

        String id1 = objectMapper.readTree(r1.getResponse().getContentAsString()).get("id").asText();
        String id2 = objectMapper.readTree(r2.getResponse().getContentAsString()).get("id").asText();
        assertThat(id1).isNotEqualTo(id2);

        eventRepository.deleteById(id1);
        eventRepository.deleteById(id2);
    }

    @Test
    void updateEvent_modifiesFields() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventPayload("Update Test Event")))
                .andExpect(status().isOk()).andReturn();

        String id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        String updatePayload = """
                {
                  "name": "Update Test Event",
                  "shortName": "UTE",
                  "dateText": "May 1, 2025",
                  "description": "Updated description.",
                  "status": "completed",
                  "icon": "✅",
                  "tags": ["Updated"]
                }
                """;

        MvcResult updated = mockMvc.perform(put("/api/admin/events/" + id)
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk()).andReturn();

        JsonNode json = objectMapper.readTree(updated.getResponse().getContentAsString());
        assertThat(json.get("status").asText()).isEqualTo("completed");
        assertThat(json.get("shortName").asText()).isEqualTo("UTE");

        eventRepository.deleteById(id);
    }

    @Test
    void deleteEvent_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/admin/events/non-existent-id")
                        .header(HttpHeaders.AUTHORIZATION, authHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteEvent_returnsOkTrue() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventPayload("Delete Me Event")))
                .andExpect(status().isOk()).andReturn();

        String id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(delete("/api/admin/events/" + id)
                        .header(HttpHeaders.AUTHORIZATION, authHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true));
    }

    @Test
    void createEvent_invalidStatus_returns400() throws Exception {
        String bad = """
                {
                  "name": "Bad Event",
                  "dateText": "April 20, 2025",
                  "description": "Some description.",
                  "status": "invalid-status"
                }
                """;
        mockMvc.perform(post("/api/admin/events")
                        .header(HttpHeaders.AUTHORIZATION, authHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bad))
                .andExpect(status().isBadRequest());
    }

    @Test
    void publicEvents_returnedInCreatedAtDescOrder() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/content/events"))
                .andExpect(status().isOk()).andReturn();

        JsonNode arr = objectMapper.readTree(result.getResponse().getContentAsString());
        // If more than one event, verify ordering
        if (arr.size() > 1) {
            String first = arr.get(0).get("createdAt").asText();
            String second = arr.get(1).get("createdAt").asText();
            assertThat(first.compareTo(second)).isGreaterThanOrEqualTo(0);
        }
    }
}
