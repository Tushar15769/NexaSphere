package org.nexasphere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    @Value("${ADMIN_EMAIL:nexasphere@glbajajgroup.org}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:Admin@123}")
    private String adminPassword;

    public boolean isValidCredentials(String email, String password) {
        return adminEmail.equals(email) && adminPassword.equals(password);
    }
}
