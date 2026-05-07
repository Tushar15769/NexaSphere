package org.nexasphere.controller;

import java.time.Instant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.nexasphere.model.TokenSession;
import org.nexasphere.service.AdminAuthService;
import org.nexasphere.service.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    private final AdminAuthService adminAuthService;
    private final TokenService tokenService;

    public AdminController(AdminAuthService adminAuthService, TokenService tokenService) {
        this.adminAuthService = adminAuthService;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String email = request.email().trim();
        String password = request.password();

        if (!adminAuthService.isValidCredentials(email, password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TokenSession session = tokenService.createSession(email);
        Instant expiresAt = session.sessionInfo().expiresAt();
        return ResponseEntity.ok(new LoginResponse(session.token(), expiresAt));
    }

    @GetMapping("/ping")
    public PingResponse ping() {
        return new PingResponse("ok");
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record LoginResponse(String token, Instant expiresAt) {
    }

    public record PingResponse(String status) {
    }
}
